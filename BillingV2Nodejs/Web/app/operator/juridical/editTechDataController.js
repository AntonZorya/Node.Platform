billingApplication.controller('editTechDataController', ['$scope', 'dataService', 'modalSvc', 'toastr', editTechDataController]);

function editTechDataController($scope, dataService, modalSvc, toastr) {

    var selectedItem = $scope.$parent.selectedItem;
    var selectedItemCopy = {};

    selectedItemCopy = _.extend(selectedItemCopy, $scope.$parent.selectedItem);

    $scope.modalItem = {
        waterPercent: selectedItem.waterPercent,
        canalPercent: selectedItem.canalPercent
    };

    $scope.save = function () {

        selectedItem.waterPercent = $scope.modalItem.waterPercent;
        selectedItem.canalPercent = $scope.modalItem.canalPercent;

        dataService.post('/clientJur/editTechData', selectedItem).then(function (response) {
            if (response.operationResult === 0) {
                modalSvc.closeModal('editTechDataModal');
            } else {
                toastr.error('Ошибка', 'Данные не сохранены');
            }

        });

    };

    $scope.cancel = function () {
        modalSvc.resolveModal('editTechDataModal');
    };
}