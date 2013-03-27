var isLoadedEntityClaim = false;


function retrieveEntityClaims(e)
{                      
    $("#ClientNameSuburbClaims").text(currentClientName + ((currentClientSuburb == null || currentClientSuburb == '') ? '' : ', ' + currentClientSuburb));
    
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






