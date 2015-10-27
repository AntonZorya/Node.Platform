/**
 * Created by Alibek on 06.10.2015.
 */
billingApplication.controller('addJurClientController', ['$scope', 'dataService', 'modalSvc', 'toastr', 'validationSvc', addJurClientController]);

function addJurClientController($scope, dataService, modalSvc, toastr, valSvc) {
    var self = this;
    this.container = $("#addJurClientContainer");
    valSvc.init($scope);


    $scope.modalItem = {
        period: $scope.$parent.period.period,
        pipelines: []
    };

    $scope.save = function () {
        $scope.commonErrors = [];
        if (!$scope.modalItem.addressId){
            $scope.commonErrors.push('Выберите адрес');
        }
        else {
            dataService.post('/clientJur/add', $scope.modalItem, self.container, $scope).then(function (response) {
                toastr.success('', 'Данные успешно сохранены');
                modalSvc.closeModal('addJurClientModal');
                $scope.$parent.search();
            });
        }
    };

    $scope.cancel = function () {
        modalSvc.closeModal('addJurClientModal');
    };

    $scope.close = function () {

    };

    $scope.address = {street: {}, house: {}, flat: {}};
    $scope.houseList = [];
    $scope.flatList = [];

    function GetByParentId(parentId, done) {
        dataService.get('/location/getByParentId', {parentId: parentId}).then(function (response) {
            if (response.operationResult === 0) {
                done(response.result);
            } else {
                toastr.error('', 'Произошла ошибка');
            }
        });
    }


    $scope.StreetChange = function () {
        GetByParentId($scope.address.street._id, function (result) {
            $scope.houseList = result;
        });
    }

    $scope.HouseChange = function () {
        GetByParentId($scope.address.house._id, function (result) {
            $scope.flatList = result;
        });
    }


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

    $scope.removeCounter = function (pipelineIndex, counterIndex) {
        $scope.modalItem.pipelines[pipelineIndex].counters.splice(counterIndex, 1);
    }

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
