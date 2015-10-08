/**
 * Created by vaio on 30.09.2015.
 */
billingApplication.controller('testCtrl', ['dataService', '$scope', 'validationSvc', 'modalSvc', testCtrl]);

function testCtrl(dataSvc, $scope, valSvc, modalSvc) {
    $scope.addressId1 = "560a2a165d686ed818ffa892";
    $scope.addressText1 = "Астана, Алматинский, Кенесары, 45, 4";
}


