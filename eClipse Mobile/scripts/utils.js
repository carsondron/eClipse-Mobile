

//var baseURL = "http://localhost/BrokerPlus.Web";   
//var baseURL = "http://localhost/BrokerPlus.WebSL4";
var baseURL = "http://localhost:50706";
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


