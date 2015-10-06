/**
 * Created by Alibek on 06.10.2015.
 */
billingApplication.controller('addFizClientController', ['$scope', 'dataService', 'modalSvc', 'toastr', 'validationSvc', addFizClientController]);

function addFizClientController($scope, dataService, modalSvc, toastr, valSvc) {

    valSvc.init($scope);


    $scope.modalItem = {
        pipelines: [{
            number: 1,
            counters: [],
            fields: []
    }] };

    $scope.save = function () {
        if ($scope.flatList.length > 0 && !$scope.address.flat.value) {
            toastr.error('', '�������� ��������');
        } else if ($scope.houseList.length > 0 && !$scope.address.house.value) {
            toastr.error('', '�������� ���');
        } else if (!$scope.address.street.value) {
            toastr.error('', '�������� �����');
        }
        else {
            var street = $scope.address.street.value;
            var house = '';
            var flat = '';
            if ($scope.address.house && $scope.address.house.value) house = ' ' + $scope.address.house.value;
            if ($scope.address.flat && $scope.address.flat.value) flat = ' ��.' + $scope.address.flat.value;
            $scope.modalItem.address = street + house + flat;
            $scope.modalItem.addressId = flat == '' ? $scope.address.house : $scope.address.flat;
            dataService.post('/clientFiz/add', $scope.modalItem).then(function (response) {
                toastr.success('', '������ ������� ���������');
                $scope.$parent.selectedItem = response.result._doc;
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
                toastr.error('', '��������� ������');
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
            toastr.warning('���������� ����� ������ ������� � �������� �����', '��������������')
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

            toastr.warning('"�������" ������ ���� ���������');

        } else {
            if (confirm('�� ������������� ������ ����� �������?')) {

                //TODO: ����� ������������ ��������������� �������� ���
                /*var day1 = (new Date($scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].dateOfCurrentCounts)).getDate();
                 var day2 = new Date().getDate();

                 if (day1 === day2) {*/
                $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].isActive = false;
                $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].isCounterNew = false;
                $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].removeDate = new Date();
                /*} */
                /*else {
                 toastr.error('����� ����� �������, ���������� ������ ��������� �� ��������� ����!');
                 }*/

            }
        }


    };
}
