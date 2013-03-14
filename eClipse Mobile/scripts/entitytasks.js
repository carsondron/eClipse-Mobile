var selectedTaskType = "All";
var isLoadedEntityTask = false;


function retrieveEntityTasks(e)
{                      
    var dsEntityTasks = new kendo.data.DataSource({
      pageSize: 30, 
      transport: {
        read: {
                url: serverURL + "GetTasks_ViewMobile?ent_id=" + currentClient + "&taskType=" + selectedTaskType,  //url specifies whether the paging should be handled by the service                           
                data: 
                {
                    Accept: "application/json"    // (JSON with padding) is required for cross-domain AJAX
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
         data: "GetTasks_ViewMobileResult.RootResults", // the data which the DataSource will be bound to is in the "results" field           
         model: {
                fields: {
                    tas_updated_when: { type: "date"},
                    tas_created_when: { type: "date"},
                    tas_created_when: { type: "date"},
                    tas_followup_date: {type: "date"},
                    tas_id: { type: "number" }
                }
            }                 
      },     
      pageable: true
    });
    
    isLoadedEntityTask = true;
    
    $("#entityTasks-listview").kendoMobileListView({
            		dataSource :dsEntityTasks,
            		template: $("#entityTasks-listview-template").html(),
                    endlessScroll: true,
                    scrollTreshold: 30, //treshold in pixels                   
            click: function (e) {                
            },
            dataBound: function () {
                
                                   }
     });
    
}

function selectedEntityTask() {          
    
     switch(this.current().index())
      {
          case 0:
                  selectedTaskType = "All";
                  GetEntityTasks();                   
                  break;
          case 1:
                  selectedTaskType = "Client";
                  GetEntityTasks();                   
                  break;
          case 2:
                  selectedTaskType = "Claim";
                  GetEntityTasks();                   
                  break;
          case 3:          
                  selectedTaskType = "Policy";
                  GetEntityTasks();                   
                  break;          
      }    
}

function GetEntityTasks() {                       
   
  
      if (isLoadedEntityTask) { 
        
      var lvTasks = $("#entityTasks-listview").data("kendoMobileListView");
      lvTasks.dataSource.transport.options.read.url = serverURL + "GetTasks_ViewMobile?ent_id=" + currentClient + "&taskType=" + selectedTaskType, 
      lvTasks.dataSource.page(1);
      lvTasks.dataSource.read();
      lvTasks.dataSource.endlessScroll = true;          
      lvTasks.refresh();
      //app.scroller().reset();
      
      ScrollToTop();
      return;
    }
         
   isLoadedEntityTask = true;     
   
  $("#entityTasks-listview").kendoMobileListView({
		dataSource :dsEntityTasks,               
		template: $("#entityTasks-listview-template").html(),
        endlessScroll: true,
        scrollTreshold: 30, //treshold in pixels       
   });         
  
}




