var debtsSearched = false;

function retrieveDebts(e)
{    
     $("#ClientNameSuburbDebts").text(currentClientName + ((currentClientSuburb == null || currentClientSuburb == '') ? '' : ', ' + currentClientSuburb));
    
    if (debtsSearched)
    {
        var lvSearch = $("#debts-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetOutstandingDebtsMobile?ent_id=" + currentClient + "&BRClient=0&$orderby=it.pol_date_effective%252c%2bit.pol_tran_id";
        lvSearch.dataSource.page(1);
        lvSearch.dataSource.read();
        lvSearch.refresh();
        //app.scroller().reset();
               
        ScrollToTop(); 
        showLoading();
        return;
    }
    debtsSearched = true;
    
    var dsSearch = new kendo.data.DataSource(
    {
         pageSize: 10,
         transport:
         {
             read:
             {
               url: serverURL + "GetOutstandingDebtsMobile?ent_id=" + currentClient + "&BRClient=0&$orderby=it.pol_date_effective%252c%2bit.pol_tran_id",
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
           model: {
                fields: {
                    pol_date_effective: { type: "date"}
                }
               }
       },
      requestStart: function(e) {
        showLoading();
      },
       pageable: true,
       requestEnd: function(e){
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
                 //loadMore: true,
        click: function (e) {
            //showActivity(e.dataItem.EventID);
        }
        	});                               
}
