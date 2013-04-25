
var clientSearched = false;
var taskSearched = false;
var claimSearched = false;

var currentClient = -1;
var currentClientName = '';
var currentClientSuburb = '';

function retrieveClient(e)
{   
    var view = e.view;
    var itemDetailsTemplate = kendo.template($("#detailTemplate").text());            
    var clientId = typeof(view.params.id) === "undefined"? currentClient: view.params.id;           
    showLoading();
    
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
                app.hideLoading();
                currentClientName = item.ent_name;
                currentClientSuburb = item.ent_suburb;                                        
                $("#Debtor").text(currentClientName + ((currentClientSuburb == null || currentClientSuburb == '') ? '' : ', ' + currentClientSuburb));
                view.scrollerContent.html(itemDetailsTemplate(item));
                kendo.mobile.init(view.content);
        });
      
    UpdateClientBalance();   
    UpdateOSBalance();
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

function eclipseSearch() 
{            
    var searchType = document.getElementById('searchType').value;
    var inputText = document.getElementById('txtName').value;
    $("#clientResults-listview").hide();
    $("#taskResults-listview").hide();
    $("#claimResults-listview").hide();    
    app.scroller().reset();
    showLoading();
    
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
        showLoading();
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
           },
      requestStart: function(e) {
        showLoading();
      }
           },
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
        showLoading();
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
                   },
      requestStart: function(e) {
        showLoading();
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
        showLoading();
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
      requestStart: function(e) {
        showLoading();
      }
        ,
        		template: $("#claimSearchResults-listview-template").html()
        	});
}