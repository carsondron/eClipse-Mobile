

//var baseURL = "http://localhost/BrokerPlus.Web";   
//var baseURL = "http://localhost/BrokerPlus.WebSL4";
var baseURL = "http://localhost:50706";
//var baseURL = "http://192.168.140.23/EclipseMobile";
// var baseURL = "http://192.168.10.171/demo";
//var baseURL = "http://203.110.139.199/demo";
var serverURL = baseURL + "/ClientBin/BrokerPlus-Web-BrokerPlusDomainService.svc/JSON/";
var authURL = baseURL + "/ClientBin/BrokerPlus-Web-AuthenticationService.svc/JSON/";

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
    var svrURL = localStorage.getItem("lsServerURL");
    var username = document.getElementById("username");
    username.value = localStorage.getItem("username");
    var password = document.getElementById("password");
    password.value = localStorage.getItem("password");
    
    if(svrURL == null || svrURL == "")
    {
        $("#modalview-settings").data("kendoMobileModalView").open();
        return;
    }
    baseURL = svrURL;
    serverURL = baseURL + "/ClientBin/BrokerPlus-Web-BrokerPlusDomainService.svc/JSON/";
    authURL = baseURL + "/ClientBin/BrokerPlus-Web-AuthenticationService.svc/JSON/";
    $("#modalview-login").data("kendoMobileModalView").open();    
}

function showSettingsFromLogin()
{
    $("#modalview-login").kendoMobileModalView("close");
    showSettings();
}

function showSettings()
{
    var svrURL = document.getElementById("serverUrl");
    svrURL.value = localStorage.getItem("lsServerURL");
    $("#modalview-settings").data("kendoMobileModalView").open();
}

function saveSettings()
{
    var svrURL = document.getElementById("serverUrl");
    localStorage.setItem("lsServerURL", svrURL.value);
    $("#modalview-settings").kendoMobileModalView("close");
    baseURL = svrURL;   
    
    serverURL = baseURL.value + "/ClientBin/BrokerPlus-Web-BrokerPlusDomainService.svc/JSON/";
    if(!loggedIn)
    {
        login();
    }
}

function closeModalViewSettings()
{
    $("#modalview-settings").kendoMobileModalView("close");
    if(!loggedIn)
    {
        login();
    }
}

function closeModalViewLogin()
{
    var username = document.getElementById("username"); //'SQLLoginTest';
    var password = document.getElementById("password"); //'1234';
    
    showLoading("Logging in...");
    $.ajax( 
        { 
        type: "POST",
               url: authURL + "LoginMobile",
               contentType: "application/json",
               data: '{ "userName": "' + username.value.toString() + '", "password": "' + password.value.toString()
                     + '", "Accept": "application/json"}',
               dataType: "json", 
               success: function (item)
               { 
                   app.hideLoading();
                   processLoginResult(item);
               }
        });
}

function processLoginResult(loginResult)
{
    if(loginResult.LoginMobileResult == false)
    {
        alert("Login failed.");
    }
    else
    {
        
        var remember = document.getElementById("rememberMe");
        if(remember.checked == true)
        {
            var username = document.getElementById("username");
            localStorage.setItem("username", username.value);
            var password = document.getElementById("password");
            localStorage.setItem("password", password.value);
        }
        showLoading("Connecting...");
        $.ajax( 
        { 
        type: "POST",
               url: serverURL + "GetStayAliveKeyMobile",
               contentType: "application/json",
               data: '{ "guid": "", "Accept": "application/json"}',
               dataType: "json", 
               success: function (item)
               { 
                   app.hideLoading();
                   if(item != null && item != "")
                   {
                       $("#modalview-login").kendoMobileModalView("close");
                       loggedIn = true;
                   }
                   else
                   {
                       alert("Too many session sof eClipse are already running.");
                   }
              }
        });
        
    }
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


