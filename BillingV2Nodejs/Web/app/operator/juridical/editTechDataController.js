billingApplication.controller('editTechDataController', ['$scope', 'dataService', 'modalSvc', 'toastr', editTechDataController]);

function editTechDataController($scope, dataService, modalSvc, toastr) {

    $scope.modalItem = {};
    $scope.modalItem = _.extend($scope.modalItem, $scope.$parent.selectedItem);

    $scope.save = function () {
        dataService.post('/clientJur/update', $scope.modalItem).then(function (response) {
            toastr.success('', 'Данные успешно сохранены');
            _.extend($scope.$parent.selectedItem, $scope.modalItem);
        });
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