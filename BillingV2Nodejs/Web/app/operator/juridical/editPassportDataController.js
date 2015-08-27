billingApplication.controller('editPassportDataController', ['$scope', 'dataService', 'modalSvc', 'toastr', editPassportDataController]);

function editPassportDataController($scope, dataService, modalSvc, toastr) {

    $scope.modalItem = $scope.$parent.selectedItem;

    $scope.save = function () {
        $scope.$parent.updateClientPassportData($scope.modalItem);
    };
}



