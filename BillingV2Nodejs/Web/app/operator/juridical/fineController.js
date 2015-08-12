billingApplication.controller('fineController', ['$scope', 'dataService', 'modalSvc', 'toastr', fineController]);

function fineController($scope, dataService, modalSvc, toastr) {

    var selectedItem = $scope.$parent.selectedItem;
    var id = selectedItem._id;

    $scope.fine = {
        sum: 0,
        comment: '',
        clientId: id
    };

    $scope.fineAdd = function () {
        dataService.post('/fine/add', {fine: $scope.fine}).then(function (response) {
            console.log(response.result);
        });
    };
    $scope.fineAdd();
}