billingApplication.controller('editTechDataController', ['$scope', 'dataService', 'modalSvc', 'toastr', editTechDataController]);

function editTechDataController($scope, dataService, modalSvc, toastr) {

    $scope.modalItem = $scope.$parent.selectedItem;

    $scope.save = function () {
        $scope.$parent.updateClientPassportData($scope.modalItem);
    };

    $scope.cancel = function () {
        modalSvc.resolveModal('editTechDataModal');
    };

    //TODO: Тех. данные - add newCounter
    $scope.addNewCounter = function (pipelineIndex) {
        var newCounter = {
            lastCounts: 0,
            isActive: true
        };
        $scope.modalItem.pipelines[pipelineIndex].counters.push(newCounter);
    };

    $scope.disableCounter = function (pipelineIndex, counterIndex) {

        if (confirm('Вы действительно хотите снять счетчик?')) {
            $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].isActive = false;
        }


    };


}