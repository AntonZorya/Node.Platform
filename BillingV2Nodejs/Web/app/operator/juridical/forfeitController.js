billingApplication.controller('forfeitController', ['$scope', 'dataService', 'modalSvc', 'toastr', forfeitController]);

function forfeitController($scope, dataService, modalSvc, toastr) {

    var selectedItem = $scope.$parent.selectedItem;
    var id = selectedItem._id;
    var period = $scope.$parent.period;

    $scope.forfeitDetails = {
        clientId: id,
        period: period
    };

    $scope.forfeitDetailsAdd = function () {
        dataService.post('/forfeitDetails/add', $scope.forfeitDetails).then(function (response) {

            $scope.$parent.getBalanceForClient(id);
            $scope.$parent.getAllBalance();

            console.log(response.result);
        });
    };
    //$scope.fineAdd();
}