/**
 * Created by Alibek on 08.10.2015.
 */
billingApplication.controller('editJurClientController', ['$scope', 'dataService', 'modalSvc', 'toastr', 'validationSvc', editJurClientController]);

function editJurClientController($scope, dataService, modalSvc, toastr, valSvc) {
    var self = this;
    valSvc.init($scope);
    this.container = $("#editJurClientContainer");

    $scope.modalItem = {};
    $scope.modalItem = _.extend($scope.modalItem, $scope.$parent.selectedItem);

    $scope.cancel = function () {
        modalSvc.resolveModal('editPassportDataModal');
    };

    $scope.close = function () {

    };

    var prevTarifId = $scope.modalItem.clientType.tariffId._id;
    var idsRmPipelines = [];

    $scope.save = function () {
        $scope.commonErrors = [];
        if (!$scope.modalItem.addressId) {
            $scope.commonErrors.push('Выберите адрес');
        } else {
            var current = JSON.parse(JSON.stringify($scope.modalItem));
            current.clientType.tariffId = $scope.modalItem.clientType.tariffId._id;
            var query = {
                client: current,
                idsRmPipelines: idsRmPipelines
            };
            dataService.post('/clientJur/update', query, self.container, $scope).then(function (response) {
                $scope.$parent.selectedItem = _.extend($scope.$parent.selectedItem, $scope.modalItem);
                toastr.success('', 'Данные успешно сохранены');
                modalSvc.closeModal('editJurClientModal');
                $scope.$parent.updateClientBalance($scope.modalItem._id);
            });
        }
    };

    $scope.cancel = function () {
        modalSvc.closeModal('editJurClientModal');
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

    $scope.removeCounter = function (pipelineIndex, counterIndex) {
        var pipeline = $scope.modalItem.pipelines[pipelineIndex];
        if (!pipeline._id) {
            pipeline.counters.splice(counterIndex, 1);
        }
    }

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

    $scope.addPipeline = function () {
        var newPipeline = {
            norm: 0,
            avg: 0,
            waterPercent: 100,
            canalPercent: 100,
            number: 1,
            counters: [],
            fields: [],
            sourceCounts: 0,
            checkNorm: false,
            checkAvg: false
        };
        $scope.modalItem.pipelines.push(newPipeline);
        $scope.$watch(function () {
            return newPipeline.checkNorm;
        }, function () {
            if (!self.byNorm(newPipeline)) {
                newPipeline.checkNorm = false;
            }
        }, true);
        $scope.$watch(function () {
            return newPipeline.checkAvg;
        }, function () {
            if (!self.byAvg(newPipeline)) {
                newPipeline.checkAvg = false;
            }
        }, true);
    }

    $scope.removePipeline = function (pIndex) {
        $scope.modalItem.pipelines.splice(pIndex, 1);
    }

    this.byNorm = function (pipeline) {
        if (pipeline.checkNorm && !pipeline.norm) {
            alert('Нет данных по "По норме"');
            return false;
        }
        if (pipeline.checkNorm) {
            pipeline.sourceCounts = 2;
        } else {
            pipeline.sourceCounts = 0;
        }
        return true;
    }

    this.byAvg = function (pipeline) {
        if (pipeline.checkAvg && !pipeline.avg) {
            alert('Нет данных "По среднему" ');
            return false;
        }
        var foundCounter = _.find(pipeline.counters, function (counter) {
            return counter.isActive === true;
        });

        if (pipeline.checkAvg && !foundCounter) {
            alert("Нет активного счетчика");
            return false;
        }

        if (pipeline.checkAvg) {
            foundCounter.currentCounts = foundCounter.lastCounts * 1 + pipeline.avg * 1;
            pipeline.sourceCounts = 1;
        } else {
            if (foundCounter) foundCounter.currentCounts = 0;
            pipeline.sourceCounts = 0;
        }
        return true;
    }
}