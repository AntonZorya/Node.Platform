billingApplication.controller('forfeitFizController', ['$scope', '$rootScope', 'dataService', 'modalSvc', 'toastr', forfeitController]);

function forfeitController($scope, $rootScope, dataService, modalSvc, toastr) {

    var selectedItem = $scope.$parent.selectedItem;
    var id = selectedItem._id;
    var period = $scope.$parent.period.value;

    $scope.body = {
        forfeitDetails: {
            clientId: id,
            period: period
        },
        user: $rootScope.user
    };

    $scope.forfeitDetailsAdd = function () {
        dataService.post('/forfeitDetailsFiz/add', $scope.body).then(function (response) {

            $scope.$parent.getBalanceForClient(id);
            $scope.$parent.getAllBalance();

            console.log(response.result);
        });
    };
    //$scope.fineAdd();
}