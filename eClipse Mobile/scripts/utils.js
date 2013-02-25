
function skipIfEmpty(strValue, addBreak)
{
    addBreak = (typeof addBreak === "undefined") ? false : addBreak;
    
    if(strValue == null)
    {
        return '';
    }
    var tempString = strValue.replace(' ', '');
    if(tempString == '')
    {
        return '';
    }
    else
    {
        return strValue + (addBreak ? '<br />' : '');
    }
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