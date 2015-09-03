billingApplication.controller('editTechDataController', ['$scope', 'dataService', 'modalSvc', 'toastr', editTechDataController]);

function editTechDataController($scope, dataService, modalSvc, toastr) {

    $scope.modalItem = {};
    $scope.modalItem = _.extend($scope.modalItem, $scope.$parent.selectedItem);

    $scope.save = function () {
        dataService.post('/clientJur/update', $scope.modalItem).then(function (response) {
            toastr.success('', 'Данные успешно сохранены');

            for (var i = 0; i < $scope.modalItem.pipelines.length; i++)
                for (var j = 0; j < $scope.modalItem.pipelines[i].counters.length; j++) {
                    if ($scope.modalItem.pipelines[i].counters[j].isCounterNew)
                        $scope.modalItem.pipelines[i].counters[j].isCounterNew = false;
                }

            _.extend($scope.$parent.selectedItem, $scope.modalItem);

        });


    };

    $scope.cancel = function () {
        modalSvc.resolveModal('editTechDataModal');
    };

    //TODO: Тех. данные - add newCounter
    $scope.addNewCounter = function (pipelineIndex) {

        var foundActiveCounter = _($scope.modalItem.pipelines[pipelineIndex].counters).find(function (counter) {
            return counter.isActive === true;
        });

        if (foundActiveCounter) {
            toastr.warning('Необходимо снять старый счетчик и добавить новый', 'Предупреждение')
        } else {
            var newCounter = {
                lastCounts: 0,
                isActive: true,
                isCounterNew: true,
                currentCounts: 0
            };
            $scope.modalItem.pipelines[pipelineIndex].counters.push(newCounter);
        }
    };

    $scope.disableCounter = function (pipelineIndex, counterIndex) {

        if (confirm('Вы действительно хотите снять счетчик?')) {
            $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].isActive = false;
            $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].isCounterNew = false;
            $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].removeDate = new Date()
        }


    };


}