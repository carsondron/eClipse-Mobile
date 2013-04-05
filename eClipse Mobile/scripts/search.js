
var clientSearched = false;
var taskSearched = false;
var claimSearched = false;
var debtsSearched = false;
var policiesSearched = false;
var notesSearched = false;
var docsSearched = false;
var currentClient = -1;
var currentClientName = '';
var currentClientSuburb = '';

function ShowPolicyDoc(docId, docType)
{
    $.ajax( 
    { 
        type: "POST",
               url: serverURL + "GetDocumentByIdAndWriteToTempFileMobile",
               contentType: "application/json",
               data: '{ "id": "' + docId.toString() + '", "type": "' + docType.toString() + '", "Accept": "application/json"}',
               dataType: "json", 
        success: function (item) { 
            ShowDocument(item.GetDocumentByIdAndWriteToTempFileMobileResult); 
        }
        });
}

function retrieveDocuments(e)
{
    var view = e.view;      
    
    if (docsSearched)
    {
        var lvSearch = $("#docs-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetPolicyDocumentsWebForIR?geninsID=" + view.params.id  + "&$orderby=it.jou_created_when%2bdesc";
        lvSearch.dataSource.page(1);
        lvSearch.dataSource.read();
        lvSearch.refresh();
        app.scroller().reset();
        return;
    }
    docsSearched = true;
    
    var dsSearch = new kendo.data.DataSource(
    {
         transport:
         {
             read:
             {
               url: serverURL + "GetPolicyDocumentsWebForIR?geninsID=" + view.params.id  + "&$orderby=it.jou_created_when%2bdesc",
               data: 
               {
                   Accept: "application/json"
               }
            }
       },
       schema: 
       {
            data: "GetPolicyDocumentsWebForIRResult.RootResults",
           model: {
                fields: {
                    jou_created_when: { type: "date"}
                }
               }
       }
    });

    $("#docs-listview").kendoMobileListView({
        		dataSource :dsSearch,
        		template: $("#docs-listview-template").html(),
                columns: [
                        { field:"jou_created_when"}],
                 //loadMore: true,
        click: function (e) {
            ShowPolicyDoc(e.dataItem.Id, e.dataItem.Type);
        }
        	});
}

function retrieveClient(e)
{   
    var view = e.view;
    var itemDetailsTemplate = kendo.template($("#detailTemplate").text());            
    var clientId = typeof(view.params.id) === "undefined"? currentClient: view.params.id;           
    
    var ds = new kendo.data.DataSource(
    {
         transport:
         {
             read:
             {
               url: serverURL + "GetEntity?entId=" + clientId,
               data: 
               {
                   Accept: "application/json"
               }
            }
       },
       schema: 
       {
            data: "GetEntityResult.RootResults"
       }
    });
   
    if(typeof(view.params.id)!="undefined")
        currentClient = view.params.id;
    
    ds.fetch(function() {
                item = ds.get();
                
                currentClientName = item.ent_name;
                currentClientSuburb = item.ent_suburb;                                        
                $("#Debtor").text(currentClientName + ((currentClientSuburb == null || currentClientSuburb == '') ? '' : ', ' + currentClientSuburb));
                view.scrollerContent.html(itemDetailsTemplate(item));
                kendo.mobile.init(view.content);
        });
      
    UpdateClientBalance();   
    UpdateOSBalance();
}

function retrieveDebts(e)
{    
     $("#ClientNameSuburbDebts").text(currentClientName + ((currentClientSuburb == null || currentClientSuburb == '') ? '' : ', ' + currentClientSuburb));
    
    if (debtsSearched)
    {
        var lvSearch = $("#debts-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetOutstandingDebtsMobile?ent_id=" + currentClient + "&BRClient=0&$orderby=it.pol_date_effective%252c%2bit.pol_tran_id";
        lvSearch.dataSource.page(1);
        lvSearch.dataSource.read();
        lvSearch.refresh();
        //app.scroller().reset();
               
        ScrollToTop(); 
        return;
    }
    debtsSearched = true;
    
    var dsSearch = new kendo.data.DataSource(
    {
         pageSize: 10,
         transport:
         {
             read:
             {
               url: serverURL + "GetOutstandingDebtsMobile?ent_id=" + currentClient + "&BRClient=0&$orderby=it.pol_date_effective%252c%2bit.pol_tran_id",
               data: 
               {
                   Accept: "application/json"
               }                 
            },
            parameterMap: function(options) {var parameters = {take: options.pageSize,page: options.page};return parameters; }
       },
       serverPaging: true,   
       schema: 
       {
            data: "GetOutstandingDebtsMobileResult.RootResults",
           model: {
                fields: {
                    pol_date_effective: { type: "date"}
                }
               }
       },
       pageable: true,
       requestEnd: function (e) {
                               
            } 
    });

    $("#debts-listview").kendoMobileListView({
        		dataSource :dsSearch,
                endlessScroll: true,
        		template: $("#debts-listview-template").html(),
                columns: [
                        { field:"pol_date_effective"}],
                 //loadMore: true,
        click: function (e) {
            //showActivity(e.dataItem.EventID);
        }
        	});                               
}

function UpdateClientBalance()
{               
    var dataSource = new kendo.data.DataSource(
    {
         transport:
         {
             read:
             {
               url: serverURL + "GetClientBalanceMobile?ent_id=" + currentClient + "&BRClient=0",
               data: 
               {
                   Accept: "application/json"
               }                   
            }
       },
        schema: 
           {
                data: "GetClientBalanceMobileResult.RootResults"          
           }  
    });  
  
    dataSource.fetch(function() {
                var item = dataSource.get();             
                           
                var balance = typeof(item) === "undefined" ? "$0.00" : item.ClientBalance;
                $("#DebtsBalanceOnSummary").text("Balance: " + formatNum(balance));   
                $("#DebtsBalance").text("Balance: " +formatNum(balance));                                         
        
        });            
}

function UpdateOSBalance()
{               
    var OSdataSource = new kendo.data.DataSource(
    {
         transport:
         {
             read:
             {
               url: serverURL + "GetOSBalanceForClientMobile?entId=" + currentClient,
               data: 
               {
                   Accept: "application/json"
               }                   
            }
       },
        schema: 
           {
                data: "GetOSBalanceForClientMobileResult.RootResults"          
           }  
    });            
               
    OSdataSource.fetch(function() {
                               
            item = OSdataSource.get();                                                                                                         
            
            if(typeof(item) === "undefined")
            {
                $("#btn7Days").text(formatNum(0));
                 $("#btn14Days").text(formatNum(0));
                 $("#btn30Days").text(formatNum(0));
                 $("#btn60Days").text(formatNum(0));
                 $("#btn90Days").text(formatNum(0));
                 $("#btn90PlusDays").text(formatNum(0));
                    
                 $("#btn7Days").css("background-color","Gray");                                        
                 $("#btn14Days").css("background-color","Gray");                                
                 $("#btn30Days").css("background-color","Gray");                                
                 $("#btn60Days").css("background-color","Gray");                                
                 $("#btn90Days").css("background-color","Gray");                                
                 $("#btn90PlusDays").css("background-color","Gray");                
            }
            else
            {
                $("#btn7Days").text(formatNum(item.C7Days));
                $("#btn14Days").text(formatNum(item.C7_14Days));
                $("#btn30Days").text(formatNum(item.C15_30Days));
                $("#btn60Days").text(formatNum(item.C31_60Days));
                $("#btn90Days").text(formatNum(item.C61_90Days));
                $("#btn90PlusDays").text(formatNum(item.C90Days));     
        
                // Set Background color
                var C7Dayscolor = item.C7Days == 0? "Gray" : "DarkGray";                 
                $("#btn7Days").css("background-color",C7Dayscolor);
        
                var C14Dayscolor = item.C7_14Days == 0? "Gray" : "MediumSeaGreen";                 
                $("#btn14Days").css("background-color",C14Dayscolor);
        
                var C30Dayscolor = item.C15_30Days == 0? "Gray" : "RoyalBlue";                 
                $("#btn30Days").css("background-color",C30Dayscolor);
        
                var C60Dayscolor = item.C31_60Days == 0? "Gray" : "gold";                 
                $("#btn60Days").css("background-color",C60Dayscolor);
        
                var C90Dayscolor = item.C61_90Days == 0? "Gray" : "darkorange";                 
                $("#btn90Days").css("background-color",C90Dayscolor);
        
                var C90PlusDayscolor = item.C90Days == 0? "Gray" : "Red";                 
                $("#btn90PlusDays").css("background-color",C90PlusDayscolor);
            }
                              
       });   
                                    
} 

function retrievePolicies(e)
{        
    $("#ClientNameSuburb").text(currentClientName + ((currentClientSuburb == null || currentClientSuburb == '') ? '' : ', ' + currentClientSuburb));
    
  if (policiesSearched)
    {
        var lvSearch = $("#policies-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetInterestsAndRisksMobile?entId=" + currentClient + "&showAll=true";
        lvSearch.dataSource.page(1);
        lvSearch.dataSource.read();
        lvSearch.refresh();
        
        ScrollToTop(); 
        return;
        
    }
    policiesSearched = true;       
    
   
    var policiesDS = new kendo.data.DataSource(
    {
         pageSize: 10, 
         serverPaging: true,
         transport:
         {
             read:
             {
               url: serverURL + "GetInterestsAndRisksMobile?entId=" + currentClient + "&showAll=true",
               data: 
               {
                   Accept: "application/json"
               }                   
            },
            parameterMap: function(options) {
              var parameters = {        
                take: options.pageSize,   //additional parameters sent to the remote service
                page: options.page        //next page
              };
                  
              return parameters;
            }
       },              
       schema: 
       {
           data: "GetInterestsAndRisksMobileResult.RootResults",
           model: {
                fields: {
                    genins_dtFrom: { type: "date"},
                    genins_dtTo: { type: "date"}
                }
               }
       }
    });
      
    
    $("#policies-listview").kendoMobileListView({
        		dataSource :policiesDS,
                template: $("#policies-listview-template").html(),
                endlessScroll: true,               
                scrollTreshold: 30,        		
                columns: [
                        { field:"genins_dtFrom"},
                        { field:"genins_dtTo"}]                
    });               
}


function retrievePolicy(e)
{              
    var view = e.view;       
    var policySummaryTemplate = kendo.template($("#policySummary-listview-template").text()); 
    
    var policyDS = new kendo.data.DataSource(
    {        
         transport:
         {
             read:
             {
               url: serverURL + "GetInterestsAndRisksByIdMobile?entId=" + currentClient + "&geninsId=" + view.params.id + "&showAll=true",     
               data: 
               {
                   Accept: "application/json"
               }                   
            }
       },       
       schema: 
       {
           data: "GetInterestsAndRisksByIdMobileResult.RootResults",          
           model: {
                fields: {
                    genins_dtFrom: { type: "date"},
                    genins_dtTo: { type: "date"}
                }
               }
       }        
    });         
    
    policyDS.fetch(function() 
                {
                    item = policyDS.get();                                       
                    view.scrollerContent.html(policySummaryTemplate(item));
                    kendo.mobile.init(view.content);                
                });              
}


function saveNote(e)
{
    var subject = document.getElementById("noteSubject").value;
    var email = document.getElementById("noteEmail").value;
    var noteText = document.getElementById("noteNote").value;
    var priority = document.getElementById('notPriority').value;
    
    $.ajax( 
    { 
        type: "POST",
               url: serverURL + "AddNote",
               contentType: "application/json",
               data: '{ "ent_id": "' + currentClient.toString() + '", "subject": "' + subject.toString()
                     + '", "note": "' + noteText.toString() + '", "email": "' + email.toString()
                     + '", "priority": "' + priority.toString() + '", "Accept": "application/json"}',
               dataType: "json", 
        success: function (item) { 
            app.navigate("#:back");
        }
        });
}

function cancelNoteAdd(e)
{
    app.navigate("#:back");
}

function resetNote(e)
{
    document.getElementById("noteSubject").value = "";
    email = document.getElementById("noteEmail").value = "";
    noteText = document.getElementById("noteNote").value = "";
    priority = document.getElementById('notPriority').value = 2;
}

function retrieveNotes(e)
{
    $("#ClientNameSuburbNotes").text(currentClientName + ((currentClientSuburb == null || currentClientSuburb == '') ? '' : ', ' + currentClientSuburb));
    
    if (notesSearched)
    {
        var lvSearch = $("#notes-listview").data("kendoMobileListView");
        //lvSearch.dataSource.transport.options.read.url = serverURL + "GetNotesViewsMobile?$where=(it.not_parent_id%253d%253d" + currentClient + ")";
        lvSearch.dataSource.transport.options.read.url = serverURL +"GetNotesViewsMobile?parentid=" + currentClient,
        
        lvSearch.dataSource.page(1);
        lvSearch.dataSource.read();
        lvSearch.refresh();
        ScrollToTop(); 
        return;
    }
    notesSearched = true;
    
    var dsSearch = new kendo.data.DataSource(
    {
         pageSize: 5, 
         transport:
         {
             read:
             {
               //url: serverURL +"GetNotesViewsMobile?$where=(it.not_parent_id%253d%253d" + currentClient + ")",
               url: serverURL +"GetNotesViewsMobile?parentid=" + currentClient,
               data: 
               {
                   Accept: "application/json"
               }                 
            },
            parameterMap: function(options) {
              var parameters = {        
                take: options.pageSize,   //additional parameters sent to the remote service
                page: options.page        //next page
              };
                  
              return parameters;
            }
       },
       serverPaging: true,
       pageable: true, 
       schema: 
       {
            data: "GetNotesViewsMobileResult.RootResults",
           model: {
                fields: {
                    not_created_when: { type: "date"}
                }
               }
       }
    });

    $("#notes-listview").kendoMobileListView({
        		dataSource :dsSearch,
                endlessScroll: true,
        		template: $("#notes-listview-template").html(),
                columns: [
                        { field:"not_created_when"}],
                 //loadMore: true,
        click: function (e) {
            //showActivity(e.dataItem.EventID);
        }
        	});
}

function eclipseSearch() 
{            
    var searchType = document.getElementById('searchType').value;
    var inputText = document.getElementById('txtName').value;
    $("#clientResults-listview").hide();
    $("#taskResults-listview").hide();
    $("#claimResults-listview").hide();    
    app.scroller().reset();
    
    switch(searchType)
    {
        case "Client":
            clientSearch(inputText);
        break;
        case "Task":
            taskSearch(inputText);
        break;
        case "Claim":
            claimSearch(inputText);
        break;    
    }        
      
   
}

function clientSearch(inputText)
{
    $("#clientResults-listview").show();
    
    if (clientSearched) {
        var lvSearch = $("#clientResults-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetClientsResult?searchFilter=" + inputText;
        lvSearch.dataSource.page(1);
        lvSearch.dataSource.read();
        lvSearch.refresh();
        return;
    }
    
    clientSearched = true;
    
       $("#clientResults-listview").kendoMobileListView({
       dataSource :
           {
           transport:
             {
                 read:
                 {
                   url: serverURL + "GetClientsResult?searchFilter=" + inputText,
                   data: 
                   {
                       Accept: "application/json"
                   }
                }
           },
           schema: 
           {
                data: "GetClientsResultResult.RootResults"
           }},
        		template: $("#clientSearchResults-listview-template").html(),
                 //loadMore: true,
        click: function (e) {
            //showActivity(e.dataItem.EventID);
        },
        dataBound: function () {
            if (this.dataSource.total() == 0) {
                $("#clientResults-listview").html("No Results Found");
            }
            }
        	});
}

function taskSearch(inputText)
{   
    $("#taskResults-listview").show();
    
    if (taskSearched) {
        var lvSearch = $("#taskResults-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetTasks_view?$where=(it.tas_id%253d%253d" + inputText + ")";
        lvSearch.dataSource.page(1);
        lvSearch.dataSource.read();
        lvSearch.refresh();
        return;
    }
    
    taskSearched = true;
    $("#taskResults-listview").kendoMobileListView({
        		dataSource :
                { 
                    transport: 
                    {
                       read: 
                        {
                           url: serverURL + "GetTasks_view?$where=(it.tas_id%253d%253d" + inputText + ")",
         
                           data: 
                            {
                               Accept: "application/json"
                            }
                       }
                   },
                   schema: 
                   {
                        data: "GetTasks_viewResult.RootResults"
                   }
                },
        		template: $("#taskSearchResults-listview-template").html()
        	});
}

function claimSearch(inputText)
{
    $("#claimResults-listview").show();
    
    if (claimSearched) {
        var lvSearch = $("#claimResults-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetSearchClaimsResults?insurerRef=" + inputText;
        lvSearch.dataSource.page(1);
        lvSearch.dataSource.read();
        lvSearch.refresh();
        return;
    }
    
    claimSearched = true;
    
    $("#claimResults-listview").kendoMobileListView({
        		dataSource :{ transport: {
                       read: {
                           url: serverURL + "GetSearchClaimsResults?insurerRef=" + inputText,
         
                           data: {
                               Accept: "application/json"
                           }
                       }
                   },
                   schema: {
                data: "GetSearchClaimsResultsResult.RootResults"
                       }
                    },
        		template: $("#claimSearchResults-listview-template").html()
        	});
}