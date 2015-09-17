billingApplication.controller('editPassportDataController', ['$scope', 'dataService', 'modalSvc', 'toastr', editPassportDataController]);

function editPassportDataController($scope, dataService, modalSvc, toastr) {
    $scope.modalItem = {};
    $scope.modalItem = _.extend($scope.modalItem, $scope.$parent.selectedItem);

    $scope.save = function () {
        if ($scope.flatList.length > 0 && !$scope.address.flat.value){
            toastr.error('', 'Выберите квартиру');
        } else if ($scope.houseList.length > 0 && !$scope.address.house.value){
            toastr.error('', 'Выберите дом');
        } else if (!$scope.address.street.value) {
            toastr.error('', 'Выберите улицу');
        }
        else {
            var street = $scope.address.street.value;
            var house = '';
            var flat = '';
            if ($scope.address.house && $scope.address.house.value) house = ' ' + $scope.address.house.value;
            if ($scope.address.flat && $scope.address.flat.value) flat = ' кв.' + $scope.address.flat.value;
            $scope.modalItem.address = street + house + flat;
            $scope.modalItem.addressId = flat == '' ? $scope.address.house : $scope.address.flat;
            dataService.post('/clientJur/update', $scope.modalItem).then(function (response) {
                toastr.success('', 'Данные успешно сохранены');
                _.extend($scope.$parent.selectedItem, $scope.modalItem);
            });
        }
    };

    $scope.cancel = function () {
        modalSvc.resolveModal('editPassportDataModal');
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

    var address = $scope.modalItem.addressId;
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
            GetByParentId($scope.address.house._id, function(result){
                $scope.flatList = result;
                $scope.address.flat = address;
            });
        });
    }

}