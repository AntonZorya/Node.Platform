billingApplication.controller('paymentsByPeriodController', ['$scope', 'dataService', 'modalSvc', 'toastr', paymentsByPeriodController]);

function paymentsByPeriodController($scope, dataService, modalSvc, toastr) {

    $scope.dateFrom = new Date(moment().add(-1, 'days'));
    $scope.dateTo = new Date(moment().add(1, 'days'));

    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '2015:2020'
    };

    $scope.balances = [];
    $scope.balancesByPeriod = function () {
        dataService.get('/balance/getByPeriod', {
            dateFrom: $scope.dateFrom,
            dateTo: $scope.dateTo
        }).then(function (response) {
            var balances = response.result;

            $scope.groupedBalances = _(balances).groupBy(function (bal) {
                return bal.clientJurId.name;
            });

            $scope.balancesRes = [];

            for (var key in $scope.groupedBalances) {

                var clientName = key;
                var balanceByClient = {
                    name: clientName,
                    sum: 0
                };

                _.each($scope.groupedBalances[clientName], function (bal) {
                    balanceByClient.sum = balanceByClient.sum + bal.sum;
                });

                $scope.balancesRes.push(balanceByClient);
            }


        });
    };

}