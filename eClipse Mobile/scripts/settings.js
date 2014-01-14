


function showSettingsFromLogin()
{
    $("#modalview-login").kendoMobileModalView("close");
    showSettings();
}

function showSettings()
{
    var svrURL = document.getElementById("serverUrl");
    svrURL.value = localStorage.getItem("lsServerURL") != null ? localStorage.getItem("lsServerURL") : baseURL;
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
