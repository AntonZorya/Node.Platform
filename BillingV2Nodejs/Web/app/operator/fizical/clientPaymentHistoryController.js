billingApplication.controller('clientPaymentHistoryFizController', ['$scope', 'dataService', 'modalSvc', 'toastr', clientPaymentHistoryFizController]);

function clientPaymentHistoryFizController($scope, dataService, modalSvc, toastr) {

    var selectedItem = $scope.$parent.selectedItem;
    var id = selectedItem._id;
    var period = $scope.$parent.period.value;


    $scope.modalItem = {};
    $scope.modalItem.clientBalanceDetails = [];
    $scope.getByPeriodAndClientIdWithDetails = function () {

        dataService.get('/balanceFiz/getByPeriodAndClientIdWithDetails', {
            clientId: id,
            period: period
        }).then(function (response) {
            $scope.modalItem.clientBalanceDetails = response.result;
        });
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