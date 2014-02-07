

//var baseURL = "http://localhost/BrokerPlus.Web";   
//var baseURL = "http://localhost/BrokerPlus.WebSL4";
//var baseURL = "http://localhost:50706";
//var baseURL = "http://192.168.140.23/EclipseMobile";
// var baseURL = "http://192.168.10.171/demo";
//var baseURL = "http://203.110.139.199/demo";
var serverURL = baseURL + "/ClientBin/BrokerPlus-Web-BrokerPlusDomainService.svc/JSON/";
var authURL = baseURL + "/ClientBin/BrokerPlus-Web-AuthenticationService.svc/JSON/";

function skipIfEmpty(strValue, addBreak, defaultString)
{
    addBreak = (typeof addBreak === "undefined") ? false : addBreak;
    defaultString = (typeof defaultString === "undefined") ? '' : defaultString;
    var resultString = strValue;
    
    if(strValue == null)
    {
        resultString = defaultString;
    }
    
    if(resultString.replace(' ', '') == '')
    {
        resultString = defaultString;
    }
    
    if(resultString == '')
    {
        return '';
    }
    return resultString + (addBreak ? '<br />' : '');

}

function formatNum(strValue, addBreak)
{
    addBreak = (typeof addBreak === "undefined") ? false : addBreak;
    if(strValue == null)
    {
        strValue = 0;
    }
    
    return kendo.toString(strValue, "c") + (addBreak ? '<br />' : '');
}

function getTaskCode(strValue)
{
    switch(strValue)
    {
        case "Client":
            return "E";
            break;
        case "Claim":
            return "C";
            break;
        case "Policy":
            return "P";
            break;
        default:
            return "";
            break;
    }            
}

function getTaskType(strValue)
{       
    switch(strValue)
     {
        case "Client":
            return "<p class='item-info' style='color:Blue'>" + strValue + "</p>";
            break;
        case "Claim":
            return "<p class='item-info' style='color:Red'>" + strValue + "</p>";
            break;
        case "Policy":
            return "<p class='item-info' style='color:Green'>" + strValue + "</p>";
            break;
        default:
            return "";
            break;
    }       
}

function hasNotes(strValue)
{
     if(strValue == null)
    {
        return 'No';
    }
    
    return 'Yes';        
}

function ScrollToTop(e) {
   
     setTimeout(function() {                                               
        
        var scroller = app.scroller();
        var touches = scroller.userEvents.touches;
        var dummyEvent = { event: { preventDefault: $.noop } };

        for (i = 0; i < touches.length; i ++) {
            touches[i].end(dummyEvent);
        }

        scroller.reset();                   
    }, 500);        
}

function clientFunctionSelected()
{
    switch(this.current().index())
      {
          case 0:
           app.navigate("#policiesView");
                  break;
          case 1:
              app.navigate("#debtsView");
      }
}
function loadStaticData()
{
    var clientTaskDocumentsViewModel = kendo.observable({data: [], dataSource: new kendo.data.DataSource({
            transport:{ read: { url: serverURL + "GetActiveClientTaskDocumentsView", data: "jsonp"}},    
            schema: { data: "GetActiveClientTaskDocumentsViewResult.RootResults"},
            change: function (e) {clientTaskDocumentsViewModel.set("data", this.view());}
        })});

    clientTaskDocumentsViewModel.dataSource.read();
    kendo.bind($("#docTemplates"), clientTaskDocumentsViewModel);
    
    var contactMethodsViewModel = kendo.observable({data: [], dataSource: new kendo.data.DataSource({
            transport:{ read: { url: serverURL + "GetActiveContactMethods", data: "jsonp"}},    
            schema: { data: "GetActiveContactMethodsResult.RootResults"},
            change: function (e) {contactMethodsViewModel.set("data", this.view());}
        })});

    contactMethodsViewModel.dataSource.read();
    kendo.bind($("#contactMethod"), contactMethodsViewModel);
    
    var taskTypesViewModel = kendo.observable({data: [], dataSource: new kendo.data.DataSource({
            transport:{ read: { url: serverURL + "GetActiveClientTaskTypes", data: "jsonp"}},    
            schema: { data: "GetActiveClientTaskTypesResult.RootResults"},
            change: function (e) {taskTypesViewModel.set("data", this.view());}
        })});

    taskTypesViewModel.dataSource.read();
    kendo.bind($("#taskType"), taskTypesViewModel);
        
    var taskStatusTypesViewModel = kendo.observable({data: [], dataSource: new kendo.data.DataSource({
            transport:{ read: { url: serverURL + "GetActiveClientTaskStatusTypes", data: "jsonp"}},    
            schema: { data: "GetActiveClientTaskStatusTypesResult.RootResults"},
            change: function (e) {taskStatusTypesViewModel.set("data", this.view());}
        })});

    taskStatusTypesViewModel.dataSource.read();
    kendo.bind($("#taskStatusType"), taskStatusTypesViewModel);
            
    var taskPrioritiesViewModel = kendo.observable({data: [], dataSource: new kendo.data.DataSource({
            transport:{ read: { url: serverURL + "GetActivePriorities", data: "jsonp"}},    
            schema: { data: "GetActivePrioritiesResult.RootResults"},
            change: function (e) {taskPrioritiesViewModel.set("data", this.view());}
        })});

    taskPrioritiesViewModel.dataSource.read();
    kendo.bind($("#taskPriority"), taskPrioritiesViewModel);
                
    var taskQueuesViewModel = kendo.observable({data: [], dataSource: new kendo.data.DataSource({
            transport:{ read: { url: serverURL + "GetQueuesForClientTaskMobile", data: "jsonp"}},    
            schema: { data: "GetQueuesForClientTaskMobileResult.RootResults"},
            change: function (e) {taskQueuesViewModel.set("data", this.view());}
        })});

    taskQueuesViewModel.dataSource.read();
    kendo.bind($("#taskQueue"), taskQueuesViewModel);
    
}

function cancelNewItem(e)
{
    app.navigate("#:back");
}
