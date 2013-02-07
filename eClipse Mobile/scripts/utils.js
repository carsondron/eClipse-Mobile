
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