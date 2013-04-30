var policiesSearched = false;

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
        showLoading();
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
        requestEnd: function(e){
            var data = e.response;
            data.GetInterestsAndRisksMobileResult.RootResults.length == 0 && e.sender._page == 1 ? $("#policiesEmpty").show() : $("#policiesEmpty").hide();
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
       },
      requestStart: function(e) {
        showLoading();
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
    showLoading();
    
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
                    app.hideLoading();
                    item = policyDS.get();                                       
                    view.scrollerContent.html(policySummaryTemplate(item));
                    kendo.mobile.init(view.content);                
                });              
}

