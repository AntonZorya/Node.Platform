billingApplication.controller('editPassportDataController', ['$scope', 'dataService', 'modalSvc', 'toastr', editPassportDataController]);

function editPassportDataController($scope, dataService, modalSvc, toastr) {

    var selectedItem = $scope.$parent.selectedItem;

    $scope.modalItem = {
        accountNumber: selectedItem.accountNumber,
        name: selectedItem.name,
        streetId: selectedItem.streetId,
        address: selectedItem.address
    };

    $scope.save = function () {
        selectedItem.accountNumber = $scope.modalItem.accountNumber;
        selectedItem.name = $scope.modalItem.name;
        selectedItem.bin = $scope.modalItem.bin;
        selectedItem.streetId = $scope.modalItem.streetId;
        selectedItem.house = $scope.modalItem.house;
        selectedItem.ap = $scope.modalItem.ap;
        selectedItem.residentsCount = $scope.modalItem.residentsCount;
        selectedItem.phone = $scope.modalItem.phone;
        selectedItem.email = $scope.modalItem.email;
        selectedItem.area = $scope.modalItem.area;
        selectedItem.kskId = $scope.modalItem.kskId;


        /*dataService.post('/clientJur/update', selectedItem).then(function (response) {
         if (response.operationResult === 0) {
         modalSvc.closeModal('passportDataModal');
         } else {
         toastr.error('Ошибка', 'Данные не сохранены');
         }
         });*/


    };
}



