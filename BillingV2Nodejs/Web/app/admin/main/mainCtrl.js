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
        var tmp = _.find($scope.passedClientsByControllers, function(item){
            return item._id.controllerId == id;
        });
        if(tmp){return tmp.total} else return 0;
    };

    $scope.getContollersRest = function(id){
        var tmpPassed = _.find($scope.passedClientsByControllers, function(item){
            return item._id.controllerId == id;
        });

        var tmpTotal = _.find($scope.allClientsByControllers, function(item){
            return item._id.controllerId == id;
        });

        if(tmpPassed && tmpTotal){return tmpTotal.total-tmpPassed.total} else return 0;
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

























}