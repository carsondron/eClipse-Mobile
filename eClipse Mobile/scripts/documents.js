
var docsSearched = false;
var taskDocsSearched = false;

function ShowDocument(url)
{
    var docUrl = baseURL + "/TempReports/" + url;

    window.open(docUrl);

    return;
    if (device.platform === 'Android')
    {
        window.plugins.childBrowser.openExternal(docUrl);
       
    }
    else
    {
        window.plugins.childBrowser.showWebPage(docUrl); 
    }
}

function displayDoc(e)
{
    var data = e.button.data();
        
    ShowPolicyDoc(data.id, data.type);
}

function displaySchedule(e)
{
    var data = e.button.data();
        
    ShowSchedule(data.id);
}

function ShowSchedule(docId)
{
    showLoading();
    $.ajax( 
    { 
        type: "POST",
               url: serverURL + "GetScheduleDocMobile",
               contentType: "application/json",
               data: '{ "worId": "' + docId.toString() + '", "Accept": "application/json"}',
               dataType: "json", 
        success: function (item) { 
            hideLoading();
            ShowDocument(item.GetScheduleDocMobileResult); 
        }
    });
}

function ShowPolicyDoc(docId, docType)
{
    showLoading();
    $.ajax( 
    { 
        type: "POST",
               url: serverURL + "GetDocumentByIdAndWriteToTempFileMobile",
               contentType: "application/json",
               data: '{ "id": "' + docId.toString() + '", "type": "' + docType.toString() + '", "Accept": "application/json"}',
               dataType: "json", 
        success: function (item) { 
            hideLoading();
            ShowDocument(item.GetDocumentByIdAndWriteToTempFileMobileResult); 
        }
    });
}

var emailTaskId;
var emailTaskType;

function emailDoc(e)
{
    var data = e.button.data();
    emailTaskId = data.id;
    emailTaskType = data.type;
    
    $("#emailAddress").val("");
    $("#emailSubject").val(data.subject);
    $("#emailMessage").val(""); 
    $("#emailAttachment").text(data.attachment);
        
}

function sendEmail()
{
    showLoading("Sending...");
    $.ajax( 
    { 
        type: "POST",
               url: serverURL + "EmailDocumentMobile",
               contentType: "application/json",
               data: '{ "id": "' + emailTaskId.toString() + '", "type": "' + emailTaskType.toString() + 
                        '", "emailTo": "' + $("#emailAddress").val().toString() + 
                        '", "subject": "' + $("#emailSubject").val().toString() + 
                        '", "message": "' + $("#emailMessage").val().toString() + '", "Accept": "application/json"}',
               dataType: "json", 
        success: function (item) { 
            hideLoading();
            app.navigate("#:back");
        }
    });
    
}

function closeEmailDocView()
{
    app.navigate("#:back");
}

function retrieveDocuments(e)
{
    var view = e.view;      
    
    if (docsSearched)
    {
        var lvSearch = $("#docs-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetPolicyDocumentsWebForIRMobile?geninsID=" + view.params.id  + "&$orderby=it.jou_created_when%2bdesc";
        lvSearch.dataSource.page(1);
        lvSearch.dataSource.read();
        lvSearch.refresh();
        app.scroller().reset();
        showLoading();
        return;
    }
    docsSearched = true;

    var dsSearch = new kendo.data.DataSource(
    {
        transport:
         {
             read:
             {
                 url: serverURL + "GetPolicyDocumentsWebForIRMobile?geninsID=" + view.params.id + "&$orderby=it.jou_created_when%2bdesc",
                 data:
               {
                   Accept: "application/json"
               }
             }
         },
        schema:
        {
           data: "GetPolicyDocumentsWebForIRMobileResult.RootResults",
           model: {
               fields: {
                   jou_created_when: { type: "date" }
               }
           }
       },
        requestStart: function (e) {
            showLoading();
        },
        requestEnd: function (e) {
            hideLoading();
            if (e.response != null) {
                var data = e.response;
                data.GetPolicyDocumentsWebForIRMobileResult.RootResults.length == 0 ? $("#polDocsEmpty").show() : $("#polDocsEmpty").hide();
            }
        }
    });

    $("#docs-listview").kendoMobileListView({
        		dataSource :dsSearch,
        		template: $("#docs-listview-template").html(),
                columns: [
                        { field:"jou_created_when"}]
        	});
}


function retrieveTaskDocuments(e)
{
    var view = e.view;      
    
    if (taskDocsSearched)
    {
        var lvSearch = $("#taskdocs-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetTaskDocumentsMobile?type=" + view.params.type  + "&id=" + view.params.id;
        lvSearch.dataSource.page(1);
        lvSearch.dataSource.read();
        lvSearch.refresh();
        app.scroller().reset();
        showLoading();
        return;
    }
    taskDocsSearched = true;

    var dsSearch = new kendo.data.DataSource(
    {
        transport:
         {
             read:
             {
                 url: serverURL + "GetTaskDocumentsMobile?type=" + view.params.type  + "&id=" + view.params.id,
                 data:
               {
                   Accept: "application/json"
               }
             }
         },
        schema:
       {
           data: "GetTaskDocumentsMobileResult.RootResults",
           model: {
               fields: {
                   Date: { type: "date" }
               }
           }
       },
        requestStart: function (e) {
            showLoading();
        },
        requestEnd: function (e) {
            hideLoading();
            if (e.response != null) {
                var data = e.response;
                data.GetTaskDocumentsMobileResult.RootResults.length == 0 ? $("#taskDocsEmpty").show() : $("#taskDocsEmpty").hide();
            }
        }
    });

    $("#taskdocs-listview").kendoMobileListView({
        		dataSource :dsSearch,
        		template: $("#taskdocs-listview-template").html(),
                columns: [
                        { field:"Date"}]
        	});
}

