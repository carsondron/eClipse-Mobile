var notesSearched = false;

function saveNote(e)
{
    var subject = document.getElementById("noteSubject").value;
    var email = document.getElementById("noteEmail").value;
    var noteText = document.getElementById("noteNote").value;
    var priority = document.getElementById('notPriority').value;
    
    showLoading("Saving...");
    $.ajax( 
    { 
        type: "POST",
               url: serverURL + "AddNote",
               contentType: "application/json",
               data: '{ "ent_id": "' + currentClient.toString() + '", "subject": "' + subject.toString()
                     + '", "note": "' + noteText.toString() + '", "email": "' + email.toString()
                     + '", "priority": "' + priority.toString() + '", "Accept": "application/json"}',
               dataType: "json", 
        success: function (item) { 
            hideLoading();
            app.navigate("#:back");
        }
        });
}

function cancelNoteAdd(e)
{
    app.navigate("#:back");
}

function resetNote(e)
{
    document.getElementById("noteSubject").value = "";
    email = document.getElementById("noteEmail").value = "";
    noteText = document.getElementById("noteNote").value = "";
    priority = document.getElementById('notPriority').value = 2;
}

function retrieveNotes(e)
{
    $("#ClientNameSuburbNotes").text(currentClientName + ((currentClientSuburb == null || currentClientSuburb == '') ? '' : ', ' + currentClientSuburb));
    
    if (notesSearched)
    {
        var lvSearch = $("#notes-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL +"GetNotesViewsMobile?parentid=" + currentClient,

        lvSearch.dataSource.page(1);
        lvSearch.dataSource.read();
        lvSearch.refresh();
        ScrollToTop(); 
        showLoading();
        return;
    }
    notesSearched = true;
    
    var dsSearch = new kendo.data.DataSource(
    {
         pageSize: 10, 
         transport:
         {
             read:
             {
               //url: serverURL +"GetNotesViewsMobile?$where=(it.not_parent_id%253d%253d" + currentClient + ")",
               url: serverURL +"GetNotesViewsMobile?parentid=" + currentClient,
               data: 
               {
                   Accept: "application/json"
               }                 
            },
            parameterMap: function(options) {
              var parameters = {        
                take: options.pageSize,   //additional parameters sent to the remote service
                page: options.page        //next page
              };
                  
              return parameters;
            }
       },
       serverPaging: true,
       pageable: true, 
       schema: 
       {
            data: "GetNotesViewsMobileResult.RootResults",
           model: {
                fields: {
                    not_created_when: { type: "date"}
                }
               },
               total: function(response) 
               {
                   return response.GetNotesViewsMobileResult.RootResults.length == 0 ? 0 : response.GetNotesViewsMobileResult.RootResults[0].TotalRecords;
               }
       },
        requestEnd: function(e){
            hideLoading();
            var data = e.response;
            data.GetNotesViewsMobileResult.RootResults.length == 0 && e.sender._page == 1 ? $("#notesEmpty").show() : $("#notesEmpty").hide();
        },  
      requestStart: function(e) {
        showLoading();
      }
    });

    $("#notes-listview").kendoMobileListView({
        		dataSource :dsSearch,
                endlessScroll: true,
        		template: $("#notes-listview-template").html(),
                columns: [
                        { field:"not_created_when"}],
                scrollTreshold: 30 //treshold in pixels   
        
        	});
}
