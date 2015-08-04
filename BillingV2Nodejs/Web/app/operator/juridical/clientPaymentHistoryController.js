billingApplication.controller('clientPaymentHistoryController', ['$scope', 'dataService', 'modalSvc', 'toastr', clientPaymentHistoryController]);

function clientPaymentHistoryController($scope, dataService, modalSvc, toastr) {

    var selectedItem = $scope.$parent.selectedItem;
    var id = selectedItem._id;

    $scope.clientPayments = [];
    $scope.getClientPayments = function () {
        dataService.get('/paymentsByClientId', {clientId: id}).then(function (response) {
            $scope.clientPayments = response.result;
            console.log(response.result);
        });
    };
    $scope.getClientPayments();
}