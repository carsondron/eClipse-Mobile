
var docsSearched = false;
/*
function ShowDocument(url) {

    $("#viewer").empty();
    
    app.navigate('#pdfView');

    var docUrl = baseURL + "/TempReports/" + url;

    // Fetch the PDF document from the URL using promices
    PDFJS.getDocument(docUrl).then(function getPdfForm(pdf) {
        // Rendering all pages starting from first
        var viewer = document.getElementById('viewer');
        var pageNumber = 1;
        renderPage(viewer, pdf, pageNumber++, function pageRenderingComplete() {
            if (pageNumber > pdf.numPages)
                return; // All pages rendered
            // Continue rendering of the next page
            renderPage(viewer, pdf, pageNumber++, pageRenderingComplete);
        });
    });

    return;
}*/

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
                 url: serverURL + "GetPolicyDocumentsWebForIR?geninsID=" + view.params.id + "&$orderby=it.jou_created_when%2bdesc",
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
                   jou_created_when: { type: "date" }
               }
           }
       },
        requestStart: function (e) {
            showLoading();
        },
        requestEnd: function (e) {
            if (e.response != null) {
                var data = e.response;
                data.GetPolicyDocumentsWebForIRResult.RootResults.length == 0 ? $("#polDocsEmpty").show() : $("#polDocsEmpty").hide();
            }
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

function renderPage(div, pdf, pageNumber, callback) {
    pdf.getPage(pageNumber).then(function (page) {
        var scale = 1.5;
        var viewport = page.getViewport(scale);

        var pageDisplayWidth = viewport.width;
        var pageDisplayHeight = viewport.height;

        var pageDivHolder = document.createElement('div');
        pageDivHolder.className = 'pdfpage';
        pageDivHolder.style.width = pageDisplayWidth + 'px';
        pageDivHolder.style.height = pageDisplayHeight + 'px';
        div.appendChild(pageDivHolder);

        // Prepare canvas using PDF page dimensions
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = pageDisplayWidth;
        canvas.height = pageDisplayHeight;
        pageDivHolder.appendChild(canvas);


        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext).then(callback);

//        // Prepare and populate form elements layer
//        var formDiv = document.createElement('div');
//        pageDivHolder.appendChild(formDiv);

//        setupForm(formDiv, page, viewport);
    });
}
