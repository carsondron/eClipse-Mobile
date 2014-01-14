var debtsSearched = false;

function retrieveDebts(e)
{    
     $("#ClientNameSuburbDebts").text(currentClientName + ((currentClientSuburb == null || currentClientSuburb == '') ? '' : ', ' + currentClientSuburb));
    
    if (debtsSearched)
    {
        var lvSearch = $("#debts-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetOutstandingDebtsMobile?ent_id=" + currentClient + "&BRClient=0";
        lvSearch.dataSource.page(1);
        lvSearch.dataSource.read();
        lvSearch.refresh();
               
        ScrollToTop(); 
        showLoading();
        return;
    }
    debtsSearched = true;
    
    var dsSearch = new kendo.data.DataSource(
    {
         pageSize: 20,
         transport:
         {
             read:
             {
               url: serverURL + "GetOutstandingDebtsMobile?ent_id=" + currentClient + "&BRClient=0",
               data: 
               {
                   Accept: "application/json"
               }                 
            },
            parameterMap: function(options) {var parameters = {take: options.pageSize,page: options.page};return parameters; }
       },
       serverPaging: true,   
       schema: 
       {
           data: "GetOutstandingDebtsMobileResult.RootResults",
           model:
           {
                fields:
                {
                    pol_date_effective: { type: "date"}
                }
           },
           total: function(response) 
           {
               return response.GetOutstandingDebtsMobileResult.RootResults.length == 0 ? 0 : response.GetOutstandingDebtsMobileResult.RootResults[0].TotalRecords;
           }
       },
      requestStart: function(e) {
        showLoading();
      },
       pageable: true,
       requestEnd: function(e){
           hideLoading();
            var data = e.response;
            data.GetOutstandingDebtsMobileResult.RootResults.length == 0 && e.sender._page == 1 ? $("#debtsEmpty").show() : $("#debtsEmpty").hide();
        }  
    });

    $("#debts-listview").kendoMobileListView({
        		dataSource :dsSearch,
                endlessScroll: true,
        		template: $("#debts-listview-template").html(),
                columns: [
                        { field:"pol_date_effective"}],
                scrollTreshold: 30 //treshold in pixels          

        	});                               
}
