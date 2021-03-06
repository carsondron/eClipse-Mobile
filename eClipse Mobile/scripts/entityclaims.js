var isLoadedEntityClaim = false;
var claimsSearched = false;

function retrieveEntityClaims(e)
{                      
    $("#ClientNameSuburbClaims").text(currentClientName + ((currentClientSuburb == null || currentClientSuburb == '') ? '' : ', ' + currentClientSuburb));
    
    if (claimsSearched)
    {
        var lvSearch = $("#entityClaims-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetClaims_ViewMobile?ent_id=" + currentClient;
        lvSearch.dataSource.page(1);
        //lvSearch.dataSource.read();
        lvSearch.refresh();
        
        ScrollToTop(); 
        showLoading();
        return;
        
    }
    
    claimsSearched = true;
    
    var dsEntityClaims = new kendo.data.DataSource({
      pageSize: 10, 
      transport: {
        read: {
                url: serverURL + "GetClaims_ViewMobile?ent_id=" + currentClient,  
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
            hideLoading();
            var data = e.response;
            data.GetClaims_ViewMobileResult.RootResults.length == 0 && e.sender._page == 1 ? $("#claimsEmpty").show() : $("#claimsEmpty").hide();
        },  
      requestStart: function(e) {
        showLoading();
      },    
      serverPaging: true, //specifies whether the paging should be handled by the service       
      schema: {           // describe the result format
         data: "GetClaims_ViewMobileResult.RootResults", // the data which the DataSource will be bound to is in the "results" field           
         model: {
                fields: {
                    cla_updated_when: { type: "date"},
                    cla_created_when: { type: "date"},
                    cla_date_of_loss: { type: "date"},
                    cla_followup_date: {type: "date"},
                    cla_id: { type: "number" }
                }
            },
               total: function(response) 
               {
                   return response.GetClaims_ViewMobileResult.RootResults.length == 0 ? 0 : response.GetClaims_ViewMobileResult.RootResults[0].TotalRecords;
               }                 
      },     
      pageable: true
    });
    
    isLoadedEntityTask = true;
    
    $("#entityClaims-listview").kendoMobileListView({
            		dataSource :dsEntityClaims,
            		template: $("#entityClaims-listview-template").html(),
                    endlessScroll: true,
                    scrollTreshold: 30, //treshold in pixels                                         
     });
    
}






