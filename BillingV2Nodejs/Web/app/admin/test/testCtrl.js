/**
 * Created by vaio on 30.09.2015.
 */
billingApplication.controller('testCtrl', ['dataService', '$scope', 'validationSvc', 'modalSvc', testCtrl]);

function testCtrl(dataSvc, $scope, valSvc, modalSvc) {
    $scope.addressId1 = "560a2a165d686ed818ffa892";
    $scope.addressText1 = "Астана, Алматинский, Кенесары, 45, 4";

    $scope.clientLoads1 = [
        //{"negotiableLoad":"5625dc28d43f1d4813f92f22","quantity":1,"waterPercent":100,"canalPercent":100},{"negotiableLoad":"5625dcaad43f1d4813f92f24","quantity":1,"waterPercent":100,"canalPercent":100},{"negotiableLoad":"5625dd20d43f1d4813f92f26","quantity":1,"waterPercent":100,"canalPercent":100},{"negotiableLoad":"5625dd64d43f1d4813f92f28","quantity":1,"waterPercent":100,"canalPercent":100},{"negotiableLoad":"5625dd91d43f1d4813f92f2a","quantity":1,"waterPercent":100,"canalPercent":100},{"negotiableLoad":"5625ddf0d43f1d4813f92f2c","quantity":1,"waterPercent":100,"canalPercent":100},{"negotiableLoad":"5625de47d43f1d4813f92f2e","quantity":1,"waterPercent":100,"canalPercent":100},{"negotiableLoad":"5625de5dd43f1d4813f92f30","quantity":1,"waterPercent":100,"canalPercent":100},{"negotiableLoad":"5625de7fd43f1d4813f92f32","quantity":1,"waterPercent":100,"canalPercent":100},{"negotiableLoad":"5625dea2d43f1d4813f92f34","quantity":1,"waterPercent":100,"canalPercent":100},{"negotiableLoad":"5625dec0d43f1d4813f92f36","quantity":1,"waterPercent":100,"canalPercent":100},{"negotiableLoad":"5625ded3d43f1d4813f92f38","quantity":1,"waterPercent":100,"canalPercent":100},{"negotiableLoad":"5625df40d43f1d4813f92f3a","quantity":1,"waterPercent":100,"canalPercent":100},{"negotiableLoad":"5625df7fd43f1d4813f92f3c","quantity":1,"waterPercent":100,"canalPercent":100},{"negotiableLoad":"5625dfc3d43f1d4813f92f3e","quantity":1,"waterPercent":100,"canalPercent":100}
        //{
        //    negotiableLoad: "561ccc385f2b56601ffb536e",
        //    quantity: 1,
        //    waterPercent: 100,
        //    canalPercent: 102
        //},
        //{
        //    quantity: 2,
        //    waterPercent: 100,
        //    canalPercent: 102,
        //    totalWaterLitersPerDay: 400,
        //    totalCanalLitersPerDay: 408,
        //    createDateTime: '2015-10-16T08:46:28.878Z',
        //    isDeleted: false,
        //    _id: '5620bb0d03a6533414958b68',
        //    negotiableLoad: {
        //        _id: '561e2f4cfa3a4d22c3999940',
        //        name: 'Люди 1',
        //        litersPerDay: 200,
        //        groupNumber: 2,
        //        createDateTime: '2015-10-13T09:17:30.250Z',
        //        loadUnit: {
        //            name: '1ед',
        //            createDateTime: '2015-10-13T09:13:59.655Z',
        //            isDeleted: false,
        //            _id: '561ccba8d50bfdf01bde3fb4'
        //        }
        //    }
        //},
        //{
        //    quantity: 3,
        //    waterPercent: 100,
        //    canalPercent: 102,
        //    totalWaterLitersPerDay: 400,
        //    totalCanalLitersPerDay: 408,
        //    createDateTime: '2015-10-16T08:46:28.878Z',
        //    isDeleted: false,
        //    _id: '5620bb0d03a6533414958b68',
        //    negotiableLoad: {
        //        _id: '561ccc385f2b56601ffb536e',
        //        name: 'Люди 1',
        //        litersPerDay: 200,
        //        //groupNumber: 1,
        //        createDateTime: '2015-10-13T09:17:30.250Z',
        //        loadUnit: {
        //            name: '1ед',
        //            createDateTime: '2015-10-13T09:13:59.655Z',
        //            isDeleted: false,
        //            _id: '561ccba8d50bfdf01bde3fb4'
        //        }
        //    }
        //}
    ];
}


