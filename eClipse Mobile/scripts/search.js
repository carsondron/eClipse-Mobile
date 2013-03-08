
var clientSearched = false;
var taskSearched = false;
var claimSearched = false;
var debtsSearched = false;
var policiesSearched = false;
var docsSearched = false;
var currentClient = -1;
var currentClientName = '';

function ShowPolicyDoc(docId, docType)
{
    $.ajax( 
    { 
        type: "POST",
               url: serverURL + "GetDocumentByIdAndWriteToTempFile",
               contentType: "application/json",
               data: '{ "id": "' + docId.toString() + '", "type": "' + docType.toString() + '", "Accept": "application/json"}',
               dataType: "json", 
        success: function (item) { 
            ShowDocument(item.GetDocumentByIdAndWriteToTempFileResult); 
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
    
    var ds = new kendo.data.DataSource(
    {
         transport:
         {
             read:
             {
               url: serverURL + "GetEntity?entId=" + view.params.id,
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
    currentClient = view.params.id;
    ds.fetch(function() {
                item = ds.get();
                $("#Debtor").text(item.ent_name);
                view.scrollerContent.html(itemDetailsTemplate(item));
                kendo.mobile.init(view.content);
        });
}

function retrieveDebts(e)
{
    if (debtsSearched)
    {
        var lvSearch = $("#debts-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetOutstandingDebts?ent_id=" + currentClient + "&BRClient=0&$orderby=it.pol_date_effective%252c%2bit.pol_tran_id";
        lvSearch.dataSource.page(1);
        lvSearch.dataSource.read();
        lvSearch.refresh();
        app.scroller().reset();
        return;
    }
    debtsSearched = true;
    
    var dsSearch = new kendo.data.DataSource(
    {
         transport:
         {
             read:
             {
               url: serverURL + "GetOutstandingDebts?ent_id=" + currentClient + "&BRClient=0&$orderby=it.pol_date_effective%252c%2bit.pol_tran_id",
               data: 
               {
                   Accept: "application/json"
               }
                 
  
            }
       },
       schema: 
       {
            data: "GetOutstandingDebtsResult.RootResults",
           model: {
                fields: {
                    pol_date_effective: { type: "date"}
                }
               }
       }
    });

    $("#debts-listview").kendoMobileListView({
        		dataSource :dsSearch,
        		template: $("#debts-listview-template").html(),
                columns: [
                        { field:"pol_date_effective"}],
                 //loadMore: true,
        click: function (e) {
            //showActivity(e.dataItem.EventID);
        }
        	});
    var lvSearch2 = $("#debts-listview").data("kendoMobileListView");
        lvSearch2.bind("dataBound", function(e) {
            if(this.dataSource.data().length == 0)
            {
                $("#DebtsBalance").text("Balance: $0.00");
            }
            else
            {
                 $("#DebtsBalance").text("Balance: " + formatNum(this.dataSource.data()[0].ClientBalance));
                }
             });
}

function retrievePolicies(e)
{
    if (policiesSearched)
    {
        var lvSearch = $("#policies-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetInterestsAndRisks?entId=" + currentClient + "&showAll=true";
        lvSearch.dataSource.page(1);
        lvSearch.dataSource.read();
        lvSearch.refresh();
        app.scroller().reset();
        return;
    }
    policiesSearched = true;
    
    var dsSearch = new kendo.data.DataSource(
    {
         transport:
         {
             read:
             {
               url: serverURL + "GetInterestsAndRisks?entId=" + currentClient + "&showAll=true",
               data: 
               {
                   Accept: "application/json"
               }
                 
  
            }
       },
       schema: 
       {
            data: "GetInterestsAndRisksResult.RootResults",
           model: {
                fields: {
                    genins_dtFrom: { type: "date"},
                    genins_dtTo: { type: "date"}
                }
               }
       }
    });

    $("#policies-listview").kendoMobileListView({
        		dataSource :dsSearch,
        		template: $("#policies-listview-template").html(),
                columns: [
                        { field:"genins_dtFrom"},
                        { field:"genins_dtTo"}],
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