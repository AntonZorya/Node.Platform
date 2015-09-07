billingApplication.controller('editTechDataController', ['$scope', 'dataService', 'modalSvc', 'toastr', editTechDataController]);

function editTechDataController($scope, dataService, modalSvc, toastr) {

    $scope.modalItem = {};
    $scope.modalItem = _.extend($scope.modalItem, $scope.$parent.selectedItem);

    $scope.save = function () {
        dataService.post('/clientJur/update', $scope.modalItem).then(function (response) {

            if (response.operationResult === 0) {
                toastr.success('', 'Данные успешно сохранены');

                $scope.modalItem = response.result;
                _.extend($scope.$parent.selectedItem, $scope.modalItem);
            }

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
                currentCounts: 0,
                installDate: new Date()
            };
            $scope.modalItem.pipelines[pipelineIndex].counters.push(newCounter);
        }
    };

    $scope.disableCounter = function (pipelineIndex, counterIndex) {

        if (confirm('Вы действительно хотите снять счетчик?')) {

            var day1 = (new Date($scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].dateOfCurrentCounts)).getDate();
            var day2 = new Date().getDate();

            if (day1 === day2) {
                $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].isActive = false;
                $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].isCounterNew = false;
                $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].removeDate = new Date()
            } else {
                toastr.error('Чтобы снять счетчик, необходимо внести показания на сегодшний день!');
            }

        }


    };


}