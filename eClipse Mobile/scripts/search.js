

function eclipseSearch() {
    var inputText = document.getElementById('txtName');
    
    var serverURL = "http://localhost/BrokerPlus.WebSL4/ClientBin/BrokerPlus-Web-BrokerPlusDomainService.svc/JSON/";
    //var serverURL = "http://203.110.139.199/demo/ClientBin/BrokerPlus-Web-BrokerPlusDomainService.svc/JSON/";
    var searchType = document.getElementById('searchType').value;
    
    switch(searchType)
    {
        case "Client":
        
        	$("#searchResults-listview").kendoMobileListView({
        		dataSource :{ transport: {
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
                    },
        		template: $("#clientSearchResults-listview-template").html()
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