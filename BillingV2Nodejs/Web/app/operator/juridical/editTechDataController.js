billingApplication.controller('editTechDataController', ['$scope', 'dataService', 'modalSvc', 'toastr', editTechDataController]);

function editTechDataController($scope, dataService, modalSvc, toastr) {

    var selectedItem = $scope.$parent.selectedItem;

    $scope.modalItem = {
        waterPercent: selectedItem.waterPercent,
        canalPercent: selectedItem.canalPercent,
        markId: selectedItem.markId,
        tariff: selectedItem.clientTypeId.tariffId,
        clientType: selectedItem.clientTypeId
    };

    $scope.save = function () {
        selectedItem.waterPercent = $scope.modalItem.waterPercent;
        selectedItem.canalPercent = $scope.modalItem.canalPercent;
        //selectedItem.markId = $scope.modalItem.markId;
        selectedItem.tariff = $scope.modalItem.tariff;
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

    //TODO: Тех. данные - add newCounter
    $scope.add = function () {
        var newCounter = {};
        $scope.selectedItem.push(newCounter);
    };


}