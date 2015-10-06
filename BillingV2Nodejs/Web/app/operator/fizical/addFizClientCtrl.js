/**
 * Created by Alibek on 06.10.2015.
 */
billingApplication.controller('addFizClientController', ['$scope', 'dataService', 'modalSvc', 'toastr', 'validationSvc', addFizClientController]);

function addFizClientController($scope, dataService, modalSvc, toastr, valSvc) {
    var self = this;
    this.container = $("#addFizClientContainer");
     valSvc.init($scope);


    $scope.modalItem = {
        period: $scope.$parent.period.value,
        pipelines: [{
            number: 1,
            counters: [],
            fields: []
    }] };

    $scope.save = function () {
        $scope.commonErrors = [];
        if ($scope.flatList.length > 0 && !$scope.address.flat.value) {
            $scope.commonErrors.push('Выберите квартиру');
        } else if ($scope.houseList.length > 0 && !$scope.address.house.value) {
            $scope.commonErrors.push('Выберите дом');
        } else if (!$scope.address.street.value) {
            $scope.commonErrors.push('Выберите улицу');
        }
        else {
            var street = $scope.address.street.value;
            var house = '';
            var flat = '';
            if ($scope.address.house && $scope.address.house.value) house = ' ' + $scope.address.house.value;
            if ($scope.address.flat && $scope.address.flat.value) flat = ' кв.' + $scope.address.flat.value;
            $scope.modalItem.address = street + house + flat;
            $scope.modalItem.addressId = flat == '' ? $scope.address.house : $scope.address.flat;
            dataService.post('/clientFiz/add', $scope.modalItem, self.container, $scope).then(function (response) {
                toastr.success('', 'Данные успешно сохранены');
                modalSvc.closeModal('addFizClientModal');
                $scope.$parent.search();
            });
        }
    };

    $scope.cancel = function () {
        modalSvc.closeModal('addFizClientModal');
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
}
