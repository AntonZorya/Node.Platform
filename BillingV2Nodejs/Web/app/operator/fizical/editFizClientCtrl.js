/**
 * Created by Alibek on 06.10.2015.
 */
billingApplication.controller('editFizClientController', ['$scope', 'dataService', 'modalSvc', 'toastr', 'validationSvc', '$rootScope', editFizClientController]);

function editFizClientController($scope, dataService, modalSvc, toastr, valSvc, $rootScope) {
    var self = this;
    this.container = $("#editFizClientContainer");
    valSvc.init($scope);

    $scope.modalItem = {
        clientLoads:[]
    };
    var selected = JSON.parse(JSON.stringify($scope.$parent.selectedItem));
    $scope.modalItem = _.extend($scope.modalItem, selected);

    var removedPipelines = [];

    $scope.save = function () {
        $scope.commonErrors = [];
        if (!$scope.modalItem.addressId) {
            $scope.commonErrors.push('Выберите адрес');
        }
        else {
            var current = JSON.parse(JSON.stringify($scope.modalItem));
            current.clientType.tariffId = $scope.modalItem.clientType.tariffId._id;
            var query = {
                client: current,
                removedPipelines: removedPipelines
            };
            dataService.post('/clientFiz/update', query, self.container, $scope).then(function (response) {
                $scope.$parent.selectedItem = _.extend($scope.$parent.selectedItem, $scope.modalItem);
                toastr.success('', 'Данные успешно сохранены');
                modalSvc.closeModal('editFizClientModal');
                $scope.$parent.updateClientBalance($scope.modalItem._id);
            });
        }
    };

    $scope.cancel = function () {
        modalSvc.closeModal('editFizClientModal');
    };

    $scope.close = function () {

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
                installDate: new Date(),
                userId: $rootScope.user._id
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
                var day1 = (new Date($scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].dateOfCurrentCounts)).getDate();
                var day2 = new Date().getDate();
                if (day1 === day2) {
                    $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].isActive = false;
                    $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].isCounterNew = false;
                    $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].removeDate = new Date();
                }
                else {
                    toastr.error('Чтобы снять счетчик, необходимо внести показания на сегодшний день!');
                }
            }
        }
    };

    $scope.addNewPipeline = function (pipIndex) {
        $scope.modalItem.pipelines.push({
            number: $scope.modalItem.pipelines.length,
            description: '',
            addressId: $scope.modalItem.addressId._id,
            counters: [],
            waterPercent: 100,
            canalPercent: 100,
            isActive: true,
            fileIds: [],
            sourceCounts: 0,// 0 по счетчику, 1 по среднему, 2 по норме
            avg: null,
            norm: null,
            userId: $rootScope.user._id
        });
    }

    $scope.removePipeline = function (pipIndex) {
        if (confirm('Подтвердите удаление ввода')) {
            if ($scope.modalItem.pipelines[pipIndex]._id) {
                removedPipelines.push($scope.modalItem.pipelines[pipIndex]._id);
            }
            $scope.modalItem.pipelines.splice(pipIndex, 1);
            $scope.modalItem.userId = $rootScope.user._id;
        }
    }
}
