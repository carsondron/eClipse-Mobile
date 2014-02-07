var debtsSearched = false;

function retrieveDebts(e)
{    
     $("#ClientNameSuburbDebts").text(currentClientName + ((currentClientSuburb == null || currentClientSuburb == '') ? '' : ', ' + currentClientSuburb));
    
    if (debtsSearched)
    {
        var lvSearch = $("#debts-listview").data("kendoMobileListView");
        lvSearch.dataSource.transport.options.read.url = serverURL + "GetOutstandingDebtsMobile?ent_id=" + currentClient + "&BRClient=0";
        lvSearch.dataSource.page(1);
        //lvSearch.dataSource.read();
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

function showAgedDebt()
{
    var isSmall = $(window).width() < 400 ||$(window).height() < 400;
    
    $("#adgedDebtClientName").text(currentClientName);
    
    var OSdataSource = new kendo.data.DataSource(
    {
         transport:{read:{url: serverURL + "GetOSBalanceForClientMobile?entId=" + currentClient,
               data: 
               {
                   Accept: "application/json"
               }}},
        schema: { data: "GetOSBalanceForClientMobileResult.RootResults" }
    });            
               
    OSdataSource.fetch(function()
    {
        item = OSdataSource.get();                                                                                                         
   
        $("#chart").kendoChart({
            title: {
                position: "top",
                color: "black",
                margin: 0,
                padding: 0,
                text: "Balance : " + currentClientBalance
            },
            legend: {
                visible: false
            },
            chartArea: {
                
                background: ""
            },
            seriesDefaults: {
                labels: {
                    visible: true,
                    background: "transparent",
                    template: "#= category #: #= formatNum(value)#",
                    position: isSmall ? "insideEnd" : "outsideEnd"
                }
            },
            series: [{
                type: "pie",
                
                data: [{
                    category: "< 7 Days",
                    value: item.C7Days,
                    color: "DarkGray"
                },{
                    category: "7 - 14 Days",
                    value: item.C7_14Days,
                    color: "MediumSeaGreen"
                },{
                    category: "15 - 30 days",
                    value: item.C15_30Days,
                    color: "RoyalBlue"
                },{
                    category: "31 - 60 days",
                    value: item.C31_60Days,
                    color: "gold"
                },{
                    category: "61 - 90 days",
                    value: item.C61_90Days,
                    color: "darkorange"
                },{
                    category: "> 90 days",
                    value: item.C90Days,
                    color: "red"
                }]
            }],
            tooltip: {
                visible: true,
                format: "{0:c}"
            }
        });
                          
   });   
    
    
}
