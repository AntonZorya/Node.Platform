/**
 * Created by vaio on 30.09.2015.
 */
billingApplication.controller('testCtrl', ['dataService', '$scope', 'validationSvc', 'modalSvc', testCtrl]);

function testCtrl(dataSvc, $scope, valSvc, modalSvc) {
    $scope.id = "";
    $scope.callAddressModal = function () {

        modalSvc.showModal("/app/admin/addresses/addresses.html", 'addressesModal', $scope).then(function () {});


    };
}


