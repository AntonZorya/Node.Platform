billingApplication.controller('mainCtrl', ['dataService', '$scope','validationSvc', 'modalSvc', mainCtrl]);

function mainCtrl(dataService, $scope, valSvc, modalSvc) {
    $scope.getAllBalance = function () {

        $scope.nachisl = {};
        $scope.forfeit = {};
        $scope.payment = {};
        $scope.passedClientsByControllers=[];
        $scope.allClientsByControllers = [];
        $scope.totalClients = 0;
        $scope.totalClientsPassed = 0;
        $scope.controllers = [];

        //TODO: оптимизировать - посчитать на сервере и вернуть на клиента только суммы по всем клиентам
        dataService.get('/balance/getAllBalance', {period: 201509}).then(function (response) {

            var groupedBalances = _(response.result).groupBy(function (bal) {
                return bal.balanceTypeId.name;
            });

            $scope.nachisl = {
                name: 'Начисления',
                sum: 0
            };
            _.each(groupedBalances['Начисление'], function (bal) {
                $scope.nachisl.sum = $scope.nachisl.sum + bal.sum;
            });

            $scope.forfeit = {
                name: 'Штрафы',
                sum: 0
            };
            _.each(groupedBalances['Штраф'], function (bal) {
                $scope.forfeit.sum = $scope.forfeit.sum + bal.sum;
            });

            $scope.payment = {
                name: 'Оплата',
                sum: 0
            };
            _.each(groupedBalances['Оплата'], function (bal) {
                $scope.payment.sum = $scope.payment.sum + bal.sum;
            });

        });
    };

    $scope.getContollersPassed = function(id){
        //var tmp = _.find($scope.passedClientsByControllers, function(item){
        //    return item._id.controllerId == id;
        //});
        //if(tmp){return tmp.total} else return 0;

        if(!id){
            var sumPassed = _.reduce($scope.passedClientsByControllers, function(memo, num){ return memo + num.total; }, 0);
            var sumTotal = _.reduce($scope.allClientsByControllers, function(memo, num){ return memo + num.total; }, 0);
            if(sumPassed && sumTotal){
                return sumPassed + " (" + (sumPassed*100/sumTotal).toFixed(2) + "%)";
            }
            else return "0 (0.00%)";
        }


        var tmpPassed = _.find($scope.passedClientsByControllers, function(item){
            return item._id.controllerId == id;
        });

        var tmpTotal = _.find($scope.allClientsByControllers, function(item){
            return item._id.controllerId == id;
        });

        if(tmpPassed && tmpTotal){
            return tmpPassed.total + " (" + ((tmpPassed.total)*100/tmpTotal.total).toFixed(2) + "%)"
        } else return "0 (0.00%)";
    };


    $scope.getContollersRest = function(id){

        if(!id){
            var sumPassed = _.reduce($scope.passedClientsByControllers, function(memo, num){ return memo + num.total; }, 0);
            var sumTotal = _.reduce($scope.allClientsByControllers, function(memo, num){ return memo + num.total; }, 0);
            if(sumPassed && sumTotal){
                return sumTotal-sumPassed + " (" + ((sumTotal-sumPassed)*100/sumTotal).toFixed(2) + "%)";
            }
            else return "0 (0.00%)";
        }

        var tmpPassed = _.find($scope.passedClientsByControllers, function(item){
            return item._id.controllerId == id;
        });

        var tmpTotal = _.find($scope.allClientsByControllers, function(item){
            return item._id.controllerId == id;
        });

        if(tmpPassed && tmpTotal){
            return tmpTotal.total-tmpPassed.total + " (" + ((tmpTotal.total-tmpPassed.total)*100/tmpTotal.total).toFixed(2) + "%)"
        } else return "0 (0.00%)";
    };




    dataService.get('/report5', {period: 201509}).then(function (response) {
       $scope.passedClientsByControllers = response.result;
        dataService.get('/report6', {period: 201509}).then(function (response) {
            $scope.allClientsByControllers = response.result;
            $scope.totalClients = 0;
            _.each($scope.allClientsByControllers, function(item){
                $scope.totalClients+=item.total;
            });

            $scope.totalClientsPassed = 0;
            _.each( $scope.passedClientsByControllers, function(item){
                $scope.totalClientsPassed+=item.total;
            });



            $('#container').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                     text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    name: "Клиенты",
                    colorByPoint: true,
                    data: [{
                        name: "Пройденых",
                        y: $scope.totalClientsPassed,
                        sliced: true,
                        selected: true
                    }, {
                        name: "Не пройденых",
                        y: $scope.totalClients - $scope.totalClientsPassed,

                    }]
                }]
            });

        });
    });


    dataService.get('/controllers').then(function (response) {
        $scope.controllers = response.result;
    });



    $scope.getAllBalance();

    $scope.resultTotals = {};
    $scope.result = [];

    $scope.getReport2 = function(){
        $scope.resultTotals = {};
        dataService.get("/report2", {period: 201509}).then(function(res) {
            $scope.result = res.result;
            $scope.resultTotals.passed = 0;
            $scope.resultTotals.sumWaterCubic = 0;
            $scope.resultTotals.sumCanalCubic = 0;
            $scope.resultTotals.sumWaterMoney = 0;
            $scope.resultTotals.sumCanalMoney = 0;
            $scope.resultTotals.sumForfeitMoney = 0;
            $scope.resultTotals.sumTotalMoney = 0;

            _.each(res.result, function(elem){
                if(elem.passed)
                    $scope.resultTotals.passed += parseInt(elem.passed);
                if(elem.sumWaterCubic)
                    $scope.resultTotals.sumWaterCubic += parseFloat(elem.sumWaterCubic);
                if(elem.sumCanalCubic)
                    $scope.resultTotals.sumCanalCubic += parseFloat(elem.sumCanalCubic);
                if(elem.sumWaterMoney)
                    $scope.resultTotals.sumWaterMoney += parseFloat(elem.sumWaterMoney);
                if(elem.sumCanalMoney)
                    $scope.resultTotals.sumCanalMoney += parseFloat(elem.sumCanalMoney);
                if(elem.sumForfeitMoney)
                    $scope.resultTotals.sumForfeitMoney += parseFloat(elem.sumForfeitMoney);
                if(elem.sumTotalMoney)
                    $scope.resultTotals.sumTotalMoney += parseFloat(elem.sumTotalMoney);
            });

            //$scope.resultTotals.passed = $scope.resultTotals.passed.toFixed(2);
            $scope.resultTotals.sumWaterCubic = $scope.resultTotals.sumWaterCubic.toFixed(2);
            $scope.resultTotals.sumCanalCubic = $scope.resultTotals.sumCanalCubic.toFixed(2);
            $scope.resultTotals.sumWaterMoney = $scope.resultTotals.sumWaterMoney.toFixed(2);
            $scope.resultTotals.sumCanalMoney = $scope.resultTotals.sumCanalMoney.toFixed(2);
            $scope.resultTotals.sumForfeitMoney = $scope.resultTotals.sumForfeitMoney.toFixed(2);
            $scope.resultTotals.sumTotalMoney = $scope.resultTotals.sumTotalMoney.toFixed(2);


        });
    };

    $scope.getReport2();





















}