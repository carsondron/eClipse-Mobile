var loaded = false;
var curr_year = "";
var curr_month = "";
var curr_date = "";
var isClientTask = true;
var isClaimTask = true;
var isPolicyTask = true;
var selectedTaskType = "Client";
    

function GetAllOutstandingTasks(){   
  isClientTask = true  
  isClaimTask = true; 
  GetOutstandingTasks();  
  UpdatedSelectedTask("All");  
 
}

var today = new Date();
var taskDate = new Date();
taskDate.setDate(today.getDate()+1); // Add 7 days    

curr_date = ('0' +taskDate.getDate()).slice(-2); // Add leading zeroes to date and .slice(-2) gives us the last two characters of the string.
curr_month = ('0' + (taskDate.getMonth() + 1)).slice(-2); //Months are zero based
curr_year = taskDate.getFullYear(); 

var dataSource = new kendo.data.DataSource({
  pageSize: 10, 
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
  serverPaging: true, //specifies whether the paging should be handled by the service  
 
  schema: { // describe the result format
     data: "GetTasksForUserMobileResult.RootResults", // the data which the DataSource will be bound to is in the "results" field
     //total: "GetTasksForUserResult.TotalCount",
     model: {
            fields: {
                tas_followup_date: { type: "date"},
                tas_id: { type: "number" }
            }
        }           
      
  }
});
   

function GetOutstandingTasks() {                       
    
      if (loaded) { 
        
      var lvTasks = $("#outstandingTasksResults-listview").data("kendoMobileListView");
      lvTasks.dataSource.transport.options.read.url = serverURL + "GetTasksForUserMobile?user=%25&date=" + curr_year + "-" + curr_month + "-" + curr_date  + "&IsClientTask=" + isClientTask+ "&IsClaimTask=" + isClaimTask + "&IsPolicyTask=" + isPolicyTask;
      lvTasks.dataSource.page(1);
      lvTasks.dataSource.read();
      lvTasks.dataSource.endlessScroll = true;          
      lvTasks.refresh();
      //app.scroller().reset();
          
      ScrollToTop();
      return;
    }
          
   loaded = true;     
   
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
                    tas_followup_date: { type: "date"}
                }
            }  
       },
       filterable: true,
       pageable: true
    });  
   
    
   // alert(view.params.tas_id);
    
    //dataSource.filter([{"filters":[{field: "tas_id", operator : "eq", value : view.params.tas_id}]}]);        
    
    
    ds.fetch(function() 
                {
                    item = ds.get();
                    view.scrollerContent.html(itemDetailsTemplate(item));
                    kendo.mobile.init(view.content);                
                });            
}


















