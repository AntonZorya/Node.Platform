billingApplication.controller('paymentsByPeriodController', ['$scope', 'dataService', 'modalSvc', 'toastr', paymentsByPeriodController]);

function paymentsByPeriodController($scope, dataService, modalSvc, toastr) {

    $scope.dateFrom = new Date(moment().add(-1, 'days'));
    $scope.dateTo = new Date(moment().add(1, 'days'));

    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '2015:2020'
    };

    $scope.payments = [];
    $scope.paymentsByPeriod = function () {
        dataService.get('/paymentsByPeriod', {
            dateFrom: $scope.dateFrom,
            dateTo: $scope.dateTo
        }).then(function (response) {
            $scope.payments = response.result;
        });
    };

}