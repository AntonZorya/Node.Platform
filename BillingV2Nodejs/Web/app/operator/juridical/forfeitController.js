billingApplication.controller('forfeitController', ['$scope', 'dataService', 'modalSvc', 'toastr', forfeitController]);

function forfeitController($scope, dataService, modalSvc, toastr) {

    var selectedItem = $scope.$parent.selectedItem;
    var id = selectedItem._id;

    $scope.forfeitDetails = {
        clientId: id
    };

    $scope.fofeitDetailsAdd = function () {
        dataService.post('/forfeitDetails/add', $scope.forfeitDetails).then(function (response) {
            console.log(response.result);
        });
    };
    //$scope.fineAdd();
}