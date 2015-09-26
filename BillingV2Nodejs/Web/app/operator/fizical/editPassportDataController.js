billingApplication.controller('editPassportDataFizController', ['$scope', 'dataService', 'modalSvc', 'toastr', editPassportDataController]);

function editPassportDataController($scope, dataService, modalSvc, toastr) {
    $scope.modalItem = {};
    $scope.modalItem = _.extend($scope.modalItem, $scope.$parent.selectedItem);

    $scope.save = function () {
        dataService.post('/clientFiz/update', $scope.modalItem).then(function (response) {
            toastr.success('', 'Данные успешно сохранены');
            _.extend($scope.$parent.selectedItem, $scope.modalItem);
        });
    };

    $scope.cancel = function () {
        modalSvc.resolveModal('editPassportDataModal');
    };

    $scope.close = function () {

    };
}



