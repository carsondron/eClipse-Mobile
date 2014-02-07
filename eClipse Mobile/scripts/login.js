
var loggedIn = false;

function login()
{
    var svrURL = localStorage.getItem("lsServerURL");
    var username = document.getElementById("username");
    
    loaderElement = app.pane.loader.element.find("h1");
    
    username.value = localStorage.getItem("username") != null ? localStorage.getItem("username") : defaultUsername;
    var password = document.getElementById("password");
    password.value = localStorage.getItem("password") != null ? localStorage.getItem("password") : defaultPassword;
    
    if(svrURL == null || svrURL == "")
    {
        var serverURL = document.getElementById("serverUrl");
        serverURL.value = baseURL;
        $("#modalview-settings").data("kendoMobileModalView").open();
        return;
    }
    baseURL = svrURL;
    serverURL = baseURL + "/ClientBin/BrokerPlus-Web-BrokerPlusDomainService.svc/JSON/";
    authURL = baseURL + "/ClientBin/BrokerPlus-Web-AuthenticationService.svc/JSON/";
    $("#modalview-login").data("kendoMobileModalView").open();    
}

function closeModalViewLogin()
{
    var username = document.getElementById("username"); //'SQLLoginTest';
    var password = document.getElementById("password"); //'1234';
    baseURL = localStorage.getItem("lsServerURL");
     serverURL = baseURL + "/ClientBin/BrokerPlus-Web-BrokerPlusDomainService.svc/JSON/";
    authURL = baseURL + "/ClientBin/BrokerPlus-Web-AuthenticationService.svc/JSON/";
    
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
                   hideLoading();
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
                   hideLoading();
                   if(item != null && item != "")
                   {
                       $("#modalview-login").kendoMobileModalView("close");
                       loggedIn = true;
                       loadStaticData();
                   }
                   else
                   {
                       alert("Too many session sof eClipse are already running.");
                   }
              }
        });
        
    }
}

