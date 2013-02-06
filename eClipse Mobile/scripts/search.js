
var searched = false;
var dsSearch;

function eclipseSearch() {
    var inputText = document.getElementById('txtName');
    
    
    var searchType = document.getElementById('searchType').value;
    
    if (searched) {
        /*dsSearch.options.transport.read.url = serverURL + "GetClientsResult?searchFilter=" + inputText.value;
        dsSearch.page(1);*/
        
        var lvSearch = $("#searchResults-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetClientsResult?searchFilter=" + inputText.value;
        lvSearch.dataSource.page(1);
        lvSearch.refresh();
        //lvSearch.dataSource.read();
        return;
    }
    //searched = true;
    dsSearch = new kendo.data.DataSource({
         transport: {
                       read: {
                           url: serverURL + "GetClientsResult?searchFilter=" + inputText.value,
         
                           data: {
                               Accept: "application/json"
                           }
                       }
                   },
                   schema: {
                data: "GetClientsResultResult.RootResults"
                       }
    });
         
    switch(searchType)
    {
        case "Client":
        
        	$("#searchResults-listview").kendoMobileListView({
        		dataSource :dsSearch,
        		template: $("#clientSearchResults-listview-template").html(),
                 //loadMore: true,
        click: function (e) {
            //showActivity(e.dataItem.EventID);
        },
        dataBound: function () {
            if (this.dataSource.total() == 0) {
                $("#searchResults-listview").html("No Results Found");
            }
            }
        	});
        break;
        
        case "Task":
        
        	$("#searchResults-listview").kendoMobileListView({
        		dataSource :
                { 
                    transport: 
                    {
                       read: 
                        {
                           url: serverURL + "GetTasks_view?$where=(it.tas_id%253d%253d" + inputText.value + ")",
         
                           data: 
                            {
                               Accept: "application/json"
                            }
                       }
                   },
                   schema: 
                   {
                        data: "GetTasks_viewResult.RootResults"
                   }
                },
        		template: $("#taskSearchResults-listview-template").html()
        	});
        break;
        
        case "Claim":
                	$("#searchResults-listview").kendoMobileListView({
        		dataSource :{ transport: {
                       read: {
                           url: serverURL + "GetSearchClaimsResults?insurerRef=" + inputText.value,
         
                           data: {
                               Accept: "application/json"
                           }
                       }
                   },
                   schema: {
                data: "GetSearchClaimsResultsResult.RootResults"
                       }
                    },
        		template: $("#claimSearchResults-listview-template").html()
        	});
        
        
        break;
    }

    
}