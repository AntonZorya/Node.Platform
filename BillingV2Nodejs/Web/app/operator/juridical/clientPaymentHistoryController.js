billingApplication.controller('clientPaymentHistoryController', ['$scope', 'dataService', 'modalSvc', 'toastr', clientPaymentHistoryController]);

function clientPaymentHistoryController($scope, dataService, modalSvc, toastr) {

    var selectedItem = $scope.$parent.selectedItem;
    var id = selectedItem._id;
    var period = $scope.$parent.period;


    $scope.modalItem = {};
    $scope.modalItem.clientBalanceDetails = [];
    $scope.getByPeriodAndClientIdWithDetails = function () {

        dataService.get('/balance/getByPeriodAndClientIdWithDetails', {
            clientId: id,
            period: period
        }).then(function (response) {
            $scope.modalItem.clientBalanceDetails = response.result;
        });

        //TODO методы с dateFrom, dateTo Переделать на period int, $scope.period (будет dropdown list)

    };
    $scope.getByPeriodAndClientIdWithDetails();


    /* $scope.getClientPayments = function () {
     dataService.get('/paymentsByClientId', {clientId: id}).then(function (response) {
     $scope.clientPayments = response.result;
     console.log(response.result);
     });
     };
     $scope.getClientPayments();*/
}