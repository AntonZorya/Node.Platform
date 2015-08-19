billingApplication.controller('forfeitController', ['$scope', 'dataService', 'modalSvc', 'toastr', forfeitController]);

function forfeitController($scope, dataService, modalSvc, toastr) {

    var selectedItem = $scope.$parent.selectedItem;
    var id = selectedItem._id;

    $scope.forfeitDetails = {
        clientId: id
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