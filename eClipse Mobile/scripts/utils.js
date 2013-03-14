

//var baseURL = "http://localhost/BrokerPlus.Web";   
//var baseURL = "http://localhost/BrokerPlus.WebSL4";
var baseURL = "http://192.168.140.23/EclipseMobile";
//var baseURL = "http://203.110.139.199/demo";
var serverURL = baseURL + "/ClientBin/BrokerPlus-Web-BrokerPlusDomainService.svc/JSON/";

var loggedIn = false;

function ShowDocument(url)
{
    var docUrl = baseURL + "/TempReports/" + url;

    if (device.platform === 'Android')
    {
        window.plugins.childBrowser.openExternal(docUrl);
       
    }
    else
    {
        window.plugins.childBrowser.showWebPage(docUrl); 
    }
}

function login()
{
    var svrURL = localStorage.getItem("ServerURL");
    if(svrURL == null || svrURL == "")
    {
        $("#modalview-settings").data("kendoMobileModalView").open();
        return;
    }
    baseURL = svrURL;
    serverURL = baseURL + "/ClientBin/BrokerPlus-Web-BrokerPlusDomainService.svc/JSON/";
    $("#modalview-login").data("kendoMobileModalView").open();    
}

function showSettings()
{
    var svrURL = document.getElementById("serverUrl");
    svrURL.value = localStorage.getItem("ServerURL");
    $("#modalview-settings").data("kendoMobileModalView").open();
}

function saveSettings()
{
    var svrURL = document.getElementById("serverUrl");
    localStorage.setItem("ServerURL", svrURL.value);
    $("#modalview-settings").kendoMobileModalView("close");
    baseURL = svrURL;
    serverURL = baseURL + "/ClientBin/BrokerPlus-Web-BrokerPlusDomainService.svc/JSON/";
    if(!loggedIn)
    {
        login();
    }
}

function closeModalViewSettings()
{
    $("#modalview-settings").kendoMobileModalView("close");
}

function closeModalViewLogin()
{
    $("#modalview-login").kendoMobileModalView("close");
    loggedIn = true;
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