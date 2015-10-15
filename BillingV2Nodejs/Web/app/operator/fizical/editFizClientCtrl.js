/**
 * Created by Alibek on 06.10.2015.
 */
billingApplication.controller('editFizClientController', ['$scope', 'dataService', 'modalSvc', 'toastr', 'validationSvc', editFizClientController]);

function editFizClientController($scope, dataService, modalSvc, toastr, valSvc) {
    var self = this;
    this.container = $("#editFizClientContainer");
    valSvc.init($scope);

    $scope.modalItem = {};
    var selected = JSON.parse(JSON.stringify($scope.$parent.selectedItem));
    $scope.modalItem = _.extend($scope.modalItem, selected);

    $scope.address = {street: {}, house: {}, flat: {}};
    $scope.houseList = [];
    $scope.flatList = [];

    var address = $scope.modalItem.addressId;
    if (address) {
        if (address.parentAddresses.length == 0) {
            $scope.address.street = address;
        } else if (address.parentAddresses.length == 1) {
            GetByParentId(address.parentAddresses[0].id, function (result) {
                $scope.houseList = result;
                $scope.address.street = address.parentAddresses[0];
                $scope.address.street._id = $scope.address.street.id;
                $scope.address.street.value = $scope.address.street.name;
                $scope.address.house = address;
            });
        } else {
            GetByParentId(address.parentAddresses[1].id, function (result) {
                $scope.houseList = result;
                $scope.address.street = address.parentAddresses[1];
                $scope.address.street._id = $scope.address.street.id;
                $scope.address.street.value = $scope.address.street.name;
                $scope.address.house = address.parentAddresses[0];
                $scope.address.house._id = $scope.address.house.id;
                $scope.address.house.value = $scope.address.house.name;
                GetByParentId($scope.address.house._id, function (result) {
                    $scope.flatList = result;
                    $scope.address.flat = address;
                });
            });
        }
    }

    var removedPipelines = [];

    $scope.save = function () {
        $scope.commonErrors = [];
        if ($scope.houseList.length > 0 && !$scope.address.house.value) {
            $scope.commonErrors.push('Выберите дом');
        } else if (!$scope.address.street.value) {
            $scope.commonErrors.push('Выберите улицу');
        }
        else {
            var street = $scope.address.street.value;
            var house = '';
            var flat = '';
            var address = $scope.address.street;
            if ($scope.address.house && $scope.address.house.value) {
                house = ' ' + $scope.address.house.value;
                address = $scope.address.house;
                address.parentId = [
                    $scope.address.street
                ];
            }
            if ($scope.address.flat && $scope.address.flat.value) {
                flat = ' кв.' + $scope.address.flat.value;
                address = $scope.address.flat;
                address.parentId = [
                    $scope.address.house,
                    $scope.address.street
                ];
            }
            $scope.modalItem.address = street + house + flat;
            var current = JSON.parse(JSON.stringify($scope.modalItem));
            $scope.modalItem.addressId = address;
            current.addressId = address._id;
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
            norm: null
        });
    }

    $scope.removePipeline = function (pipIndex) {
        if (confirm('Подтвердите удаление ввода')) {
            if ($scope.modalItem.pipelines[pipIndex]._id) {
                removedPipelines.push($scope.modalItem.pipelines[pipIndex]._id);
            }
            $scope.modalItem.pipelines.splice(pipIndex, 1);
        }
    }
}
