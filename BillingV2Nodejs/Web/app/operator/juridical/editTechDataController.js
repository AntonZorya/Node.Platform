billingApplication.controller('editTechDataController', ['$scope', 'dataService', 'modalSvc', 'toastr', editTechDataController]);

function editTechDataController($scope, dataService, modalSvc, toastr) {

    $scope.modalItem = $scope.$parent.selectedItem;

    $scope.save = function () {
        $scope.$parent.updateClientPassportData($scope.modalItem);
    };

    /*$scope.modalItem = {
     waterPercent: selectedItem.waterPercent,
     canalPercent: selectedItem.canalPercent,
     markId: selectedItem.markId,
     tariff: selectedItem.clientType.tariffId,
     clientType: selectedItem.clientType
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
     };*/

    $scope.cancel = function () {
        modalSvc.resolveModal('editTechDataModal');
    };

    //TODO: Тех. данные - add newCounter
    $scope.addNewCounter = function (pipelineIndex) {
        var newCounter = {
            isActive: true
        };
        $scope.modalItem.pipelines[pipelineIndex].counters.push(newCounter);
    };

    $scope.disableCounter = function (pipelineIndex, counterIndex) {
        $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].isActive = false;
    };

    /*$scope.del = function (index) {
     $scope.
     }*/


}