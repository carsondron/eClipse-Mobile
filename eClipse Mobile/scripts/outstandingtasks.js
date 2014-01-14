var loaded = false;
var curr_year = "";
var curr_month = "";
var curr_date = "";
var isClientTask = true;
var isClaimTask = true;
var isPolicyTask = true;
var selectedTaskType = "Client";
var currentTaskType = "";    

function GetAllOutstandingTasks(){   
  isClientTask = true  
  isClaimTask = true; 
  GetOutstandingTasks();  
  UpdatedSelectedTask("All");  
 
}

var today = new Date();
var taskDate = new Date();
taskDate.setDate(today.getDate()+7); // Add 7 days    

curr_date = ('0' +taskDate.getDate()).slice(-2); // Add leading zeroes to date and .slice(-2) gives us the last two characters of the string.
curr_month = ('0' + (taskDate.getMonth() + 1)).slice(-2); //Months are zero based
curr_year = taskDate.getFullYear(); 

function GetOutstandingTasks() {                       
    
    
      if (loaded) {             
          
      var lvTasks = $("#outstandingTasksResults-listview").data("kendoMobileListView");
      lvTasks.dataSource.transport.options.read.url = serverURL + "GetTasksForUserMobile?user=%25&date=" + curr_year + "-" + curr_month + "-" + curr_date  + "&IsClientTask=" + isClientTask+ "&IsClaimTask=" + isClaimTask + "&IsPolicyTask=" + isPolicyTask;
      lvTasks.dataSource.page(1);
      lvTasks.dataSource.read();
      lvTasks.refresh();
      //app.scroller().reset();
          
      ScrollToTop();
      return;
    }
          
   loaded = true;         
    
   var dataSource = new kendo.data.DataSource({
      pageSize: 30, 
      transport: {
      read: {
            url: serverURL + "GetTasksForUserMobile?user=%25&date=" + curr_year + "-" + curr_month + "-" + curr_date  + "&IsClientTask=" + isClientTask+ "&IsClaimTask=" + isClaimTask + "&IsPolicyTask=" + isPolicyTask,  //url specifies whether the paging should be handled by the service                           
            data: 
            {
                Accept: "application/json"// (JSON with padding) is required for cross-domain AJAX
            }  
        },
        parameterMap: function(options) {
          var parameters = {        
            take: options.pageSize,//additional parameters sent to the remote service
            page: options.page //next page
          };
              
          return parameters;
        }
      }, 
       requestEnd: function(e){
           hideLoading();
        },  
  serverPaging: true, //specifies whether the paging should be handled by the service  
 
  schema: { // describe the result format
     data: "GetTasksForUserMobileResult.RootResults", // the data which the DataSource will be bound to is in the "results" field

     model: {
            fields: {
                tas_followup_date: { type: "date"},
                tas_id: { type: "number" },
                ent_id: { type: "number" }
            }
        },
               total: function(response) 
               {
                   return response.GetTasksForUserMobileResult.RootResults.length == 0 ? 0 : response.GetTasksForUserMobileResult.RootResults[0].TotalRecords;
               }           
      
  }
}); 
    
    
  $("#outstandingTasksResults-listview").kendoMobileListView({
        		dataSource :dataSource,               
        		template: $("#outstandingTasksResults-listview-template").html(),
                endlessScroll: true,
                scrollTreshold: 30, //treshold in pixels
                columns: [
                        { field:"tas_followup_date" }]
   });         
    
}

function UpdatedSelectedTask(type) {
    
   
    var selectedTaskTextElem = document.getElementById('selectedTaskText');           
    selectedTaskTextElem.innerHTML = 'Outstanding Tasks';    
    selectedTaskTextElem.style.display = 'block';    
}

  function selectedTask() { 
  
     switch(this.current().index())
      {
          case 0:
                  isClientTask = true;
                  isClaimTask = true; 
                  isPolicyTask = true;
                  GetOutstandingTasks();  
                  UpdatedSelectedTask("All");  
                  break;
          case 1:
                  isClientTask = true; 
                  isClaimTask = false; 
                  isPolicyTask = false;
                  GetOutstandingTasks();  
                  UpdatedSelectedTask("Client");  
                  break;
          case 2:
                  isClientTask = false;  
                  isClaimTask = true; 
                  isPolicyTask = false;
                  GetOutstandingTasks();  
                  UpdatedSelectedTask("Claim");  
                  break;
          case 3:          
                  isClientTask = false;  
                  isClaimTask = false;
                  isPolicyTask = true;
                  GetOutstandingTasks();  
                  UpdatedSelectedTask("Policy");  
                  break;          
      }                  
}

function customParse(data) {
    return new Date(data);
}


function retrieveOutstandingTasks(e)
{           
    var view = e.view;               
    var itemDetailsTemplate = kendo.template($("#outstandingTaskDetailTemplate").text());            
        
    var ds = new kendo.data.DataSource(
    {
         transport:
         {
             read:
             {              
               url: serverURL + "GetTasksForUserByTaskId?user=%25&date=" + curr_year + "-" + curr_month + "-" + curr_date  + "&IsClientTask=" + isClientTask+ "&IsClaimTask=" + isClaimTask + "&IsPolicyTask=" + isPolicyTask + "&TaskId=" + view.params.tas_id,
               filter: {field: "tas_id", operator : "eq", value : parseInt(view.params.tas_id)},       
               data: 
               {
                   Accept: "application/json"
               }
            }
       },
       schema: 
       {
             data: "GetTasksForUserByTaskIdResult.RootResults",
             total: "GetTasksForUserByTaskIdResult.TotalCount",
                model: {
                fields: {
                    tas_followup_date: { type: "date"},
                    tas_id: { type: "number" },
                    ent_id: { type: "number" }
                }
            }  
       },
       filterable: true,
       pageable: true
    });  
       
    //alert(view.params.tas_id + " " + view.params.tas_brief_description + " " +  view.ent_id + " " + currentClient);    
    //dataSource.filter([{"filters":[{field: "tas_id", operator : "eq", value : view.params.tas_id}]}]);            
    
    ds.fetch(function() 
                {
                    item = ds.get();                    
                    currentClient = item.ent_id;   
                    currentTaskType = item.TaskType;                   
                    currentClientName = item.ent_name;                   
                    UpdateSuburb(currentClient);
                    view.scrollerContent.html(itemDetailsTemplate(item));
                    kendo.mobile.init(view.content);                
                });            
}

function GoToClientSummary()
{        
    switch(currentTaskType)
    {
        case "Client":
            app.navigate("#clientSummaryView"); 
            break;
        case "Policy":
            app.navigate("#policiesView"); 
            break;
        case "Claim":
            app.navigate("#claimsView"); 
            break;                
    }
}
    
function UpdateSuburb(clientId)
{       
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
    
    ds.fetch(function() {
                item = ds.get();
                
                currentClientName = item.ent_name;
                currentClientSuburb = item.ent_suburb;                                             
        });
    
}
















