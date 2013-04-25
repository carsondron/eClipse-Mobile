
var docsSearched = false;


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
            app.hideLoading();
            ShowDocument(item.GetDocumentByIdAndWriteToTempFileMobileResult); 
        }
        });
}

function retrieveDocuments(e)
{
    var view = e.view;      
    
    if (docsSearched)
    {
        var lvSearch = $("#docs-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetPolicyDocumentsWebForIR?geninsID=" + view.params.id  + "&$orderby=it.jou_created_when%2bdesc";
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
               url: serverURL + "GetPolicyDocumentsWebForIR?geninsID=" + view.params.id  + "&$orderby=it.jou_created_when%2bdesc",
               data: 
               {
                   Accept: "application/json"
               }
            }
       },
       schema: 
       {
            data: "GetPolicyDocumentsWebForIRResult.RootResults",
           model: {
                fields: {
                    jou_created_when: { type: "date"}
                }
               }
       },
      requestStart: function(e) {
        showLoading();
      }
    });

    $("#docs-listview").kendoMobileListView({
        		dataSource :dsSearch,
        		template: $("#docs-listview-template").html(),
                columns: [
                        { field:"jou_created_when"}],
                 //loadMore: true,
        click: function (e) {
            ShowPolicyDoc(e.dataItem.Id, e.dataItem.Type);
        }
        	});
}
