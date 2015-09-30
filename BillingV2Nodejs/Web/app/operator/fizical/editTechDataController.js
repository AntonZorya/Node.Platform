billingApplication.controller('editTechDataFizController', ['$scope', 'dataService', 'modalSvc', 'toastr', editTechDataFizController]);

function editTechDataFizController($scope, dataService, modalSvc, toastr) {

    $scope.modalItem = {};
    $scope.modalItem = _.extend($scope.modalItem, $scope.$parent.selectedItem);

    var prevTarifId = $scope.modalItem.clientType.tariffId._id;

    $scope.save = function () {
        var tariff = $scope.modalItem.clientType.tariffId;
        dataService.post('/clientFiz/update', $scope.modalItem).then(function (response) {

            if (response.operationResult === 0) {
                toastr.success('', 'Данные успешно сохранены');

                // Костыль
                var address = $scope.modalItem.addressId;
                $scope.modalItem = response.result;
                $scope.modalItem.addressId = address;

                _.extend($scope.$parent.selectedItem, $scope.modalItem);
                $scope.$parent.selectedItem.clientType.tariffId = tariff;

                if (tariff._id !== prevTarifId) {
                    $scope.$emit('changeTariffId', { clientId: $scope.modalItem._id});
                }
            }

        });
    };

    $scope.cancel = function () {
        modalSvc.resolveModal('editTechDataModal');
    };

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

        if ($scope.modalItem.pipelines[pipelineIndex].avg == null ||
            $scope.modalItem.pipelines[pipelineIndex].avg == "") {

            toastr.warning('"Среднее" должно быть заполнено');

        } else {
            if (confirm('Вы действительно хотите снять счетчик?')) {

                //TODO: после тестирования раскометировать проверку дат
                /*var day1 = (new Date($scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].dateOfCurrentCounts)).getDate();
                 var day2 = new Date().getDate();

                 if (day1 === day2) {*/
                $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].isActive = false;
                $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].isCounterNew = false;
                $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].removeDate = new Date();
                /*} */
                /*else {
                 toastr.error('Чтобы снять счетчик, необходимо внести показания на сегодшний день!');
                 }*/

            }
        }


    };

}