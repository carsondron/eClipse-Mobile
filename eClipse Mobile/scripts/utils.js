

//var serverURL = "http://localhost/BrokerPlus.Web/ClientBin/BrokerPlus-Web-BrokerPlusDomainService.svc/JSON/";   
//var serverURL = "http://localhost/BrokerPlus.WebSL4/ClientBin/BrokerPlus-Web-BrokerPlusDomainService.svc/JSON/";
var serverURL = "http://192.168.140.23/EclipseMobile/ClientBin/BrokerPlus-Web-BrokerPlusDomainService.svc/JSON/";
//var serverURL = "http://203.110.139.199/demo/ClientBin/BrokerPlus-Web-BrokerPlusDomainService.svc/JSON/";

function login()
{
    $("#modalview-login").data("kendoMobileModalView").open();    
}

function closeModalViewLogin() {
    $("#modalview-login").kendoMobileModalView("close");
        GetAllOutstandingTasks();
    }

function skipIfEmpty(strValue, addBreak, defaultString)
{
    addBreak = (typeof addBreak === "undefined") ? false : addBreak;
    defaultString = (typeof defaultString === "undefined") ? '' : defaultString;
    var resultString = strValue;
    
    if(strValue == null)
    {
        resultString = defaultString;
    }
    else
    {
        resultString = strValue.replace(' ', '');
    }
    
    if(resultString == '')
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