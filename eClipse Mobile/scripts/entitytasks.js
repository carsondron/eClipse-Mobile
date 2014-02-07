var selectedTaskType = "All";
var isLoadedEntityTask = false;
var tasksSearched = false;

function retrieveEntityTasks(e)
{              
    $("#ClientNameSuburbTasks").text(currentClientName + ((currentClientSuburb == null || currentClientSuburb == '') ? '' : ', ' + currentClientSuburb));
    
    if (tasksSearched)
    {
        var lvSearch = $("#entityTasks-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetTasks_ViewMobile?ent_id=" + currentClient + "&taskType=" + selectedTaskType;
        lvSearch.dataSource.page(1);
        //lvSearch.dataSource.read();
        lvSearch.refresh();
        
        ScrollToTop(); 
        showLoading();
        return;
        
    }
    
    tasksSearched = true;
    
    var dsEntityTasks = new kendo.data.DataSource({
      pageSize: 10, 
      serverPaging: true,
      transport: {
        read: {
                url: serverURL + "GetTasks_ViewMobile?ent_id=" + currentClient + "&taskType=" + selectedTaskType,
                data: 
                {
                    Accept: "application/json"
                }  
        },
        parameterMap: function(options) {
          var parameters = {        
            take: options.pageSize,
            page: options.page
          };
              
          return parameters;
        }
      },
      requestStart: function(e) {
        showLoading();
      },  
        requestEnd: function(e){
            hideLoading();
            var data = e.response;
            data.GetTasks_ViewMobileResult.RootResults.length == 0 && e.sender._page == 1 ? $("#tasksEmpty").show() : $("#tasksEmpty").hide();
        },
      schema: 
        {
            data: "GetTasks_ViewMobileResult.RootResults",      
            model: {
                fields: {
                    tas_updated_when: { type: "date"},
                    tas_created_when: { type: "date"},
                    tas_created_when: { type: "date"},
                    tas_followup_date: {type: "date"},
                    tas_id: { type: "number" }
                    }
                  },
               total: function(response) 
               {
                   return response.GetTasks_ViewMobileResult.RootResults.length == 0 ? 0 : response.GetTasks_ViewMobileResult.RootResults[0].TotalRecords;
               }
      }
    });
    
    isLoadedEntityTask = true;
    
    $("#entityTasks-listview").kendoMobileListView({
            		dataSource :dsEntityTasks,
            		template: $("#entityTasks-listview-template").html(),
                    endlessScroll: true,
                    scrollTreshold: 30 //treshold in pixels                   
            
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
      //lvTasks.dataSource.read();
      lvTasks.dataSource.endlessScroll = true;          
      lvTasks.refresh();
      //app.scroller().reset();
      
      ScrollToTop();
      showLoading();
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

function generateQuickDoc(e)
{
    var templateId = document.getElementById('docTemplates').value;
    
    showLoading("Generating...");
      
   $.ajax( 
    { 
        type: "POST",
               url: serverURL + "GenerateClientTaskDocumentMobile",
               contentType: "application/json",
               data: '{ "entId": "' + currentClient.toString() + '", "docId": "' + templateId.toString() + '", "Accept": "application/json"}',
               dataType: "json", 
        success: function (item) { 
            hideLoading();
            ShowDocument(item.GenerateClientTaskDocumentMobileResult);
            app.navigate("#:back");
        }
    });
}

function saveNewTask()
{
    var description = document.getElementById("taskDescription").value;
    var type = document.getElementById("taskType").value;
    var status = document.getElementById("taskStatusType").value;
    var queue = document.getElementById('taskQueue').value;

    var contactMethod = document.getElementById('contactMethod').value;
    var action = document.getElementById('followupAction').value;
    if(action === "")
    {
        action = description;
    }
    var priority = document.getElementById('taskPriority').value;
    var contact = document.getElementById('contactPerson').value;
    var followupDate = new Date($("#followupDate").val());
    var phone = document.getElementById('taskPhone').value;
    var mobile = document.getElementById('taskMobile').value;
    var email = document.getElementById('taskEmail').value;
    
    var comments = document.getElementById('taskComments').value;
    
    var curr_date = ('0' + followupDate.getDate()).slice(-2); // Add leading zeroes to date and .slice(-2) gives us the last two characters of the string.
    var curr_month = ('0' + (followupDate.getMonth() + 1)).slice(-2); //Months are zero based
    var curr_year = followupDate.getFullYear(); 
    
    showLoading("Saving...");
    $.ajax( 
    { 
        type: "POST",
               url: serverURL + "SaveClientTaskMobile",
               contentType: "application/json",
               data: '{ "entId": "' + currentClient.toString() + '", "email": "' + email.toString()
                     + '", "contactMethod": "' + contactMethod.toString() + '", "description": "' + description.toString()
                     + '", "mobile": "' + mobile.toString() + '", "contact": "' + contact.toString()
                     + '", "phone": "' + phone.toString() + '", "followupAction": "' + action.toString()
                     + '", "followupDate": "' + curr_year + "-" + curr_month + "-" + curr_date + '", "notes": "' + comments.toString()
                     + '", "priority": "' + priority.toString() + '", "email": "' + email.toString()
                     + '", "type": "' + type.toString() + '", "queue": "' + queue.toString()
                     + '", "status": "' + status.toString() + '", "Accept": "application/json"}',
               dataType: "json", 
        success: function (item) { 
            hideLoading();
            app.navigate("#:back");
        }
        });
/*
int entId, string email, int contactMethod, string description, string mobile,
            string contact, string phone, string followupAction, DateTime followupDate, string notes, int priority, string queue, int type
  */  
}






