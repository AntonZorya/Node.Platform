billingApplication.controller('juridicalHistoryController', ['$scope', 'dataService', 'toastr', 'printSvc', '$templateCache', 'modalSvc', '$rootScope', '$location', juridicalHistoryController]);

function juridicalHistoryController($scope, dataService, toastr, printSvc, $templateCache, modalSvc, $rootScope, $location) {

    $scope.searchTerm = '';
    $scope.data = [];
    $scope.selectedItem = {};
    $scope.streets = [];
    $scope.counterMarks = [];
    $scope.ksks = [];
    $scope.controllers = [];
    $scope.tariffs = [];
    $scope.allBalance = [];
    $scope.balanceDetailsByClient = [];

    $scope.period = '';
    $scope.periods = [];

    $scope.toCurrentPeriod = function () {
        $location.path('/operator/juridical');
    };

    dataService.get('/jur/periods/getClosed').then(function (res) {
        $scope.periods = res.result;
        $scope.period = $scope.periods[0].period.toString();
        $scope.getAllBalance();
    });

    $scope.search = function () {
        dataService.get('/clientJur/search', {
            searchTerm: $scope.searchTerm,
            period: $scope.period
        }, null).then(function (response) {
            $scope.data = response.result;
        });
    };

    $scope.refresh = function () {
        $scope.search();
        $scope.getAllBalance();
    };

    $scope.showCounters = function (item) {
        item.pipelines.forEach(function (pipeline) {
            pipeline.checkAvg = pipeline.sourceCounts == 1;
            pipeline.checkNorm = pipeline.sourceCounts == 2;
        });
        item.isShowCounters = !item.isShowCounters;
        $scope.selectedItem = item;

        if (item.isShowCounters)
            $scope.getBalanceForClient(item._id);
    };

    $scope.print = function () {
        printSvc.printHtml($('#paymentInvoice')[0].innerHTML);
    };

    $scope.printFromHistory = function (item, name, callback) {

        $scope.paymentClientName = name;
        $scope.payment = {
            sum: item.sum,
            date: item.date,
            receiptNumber: item.receiptNumber
        };
        $scope.$apply();
        $scope.print();
    };

    $scope.getClientBalanceDetails = function () {
        modalSvc.showModal('/app/operator/juridical/clientPaymentHistory.html', 'clientPaymentHistoryModal', $scope);
    };

    $scope.getAllBalance = function () {
        dataService.get('/balance/getAllBalance', {period: $scope.period}).then(function (response) {
            $scope.nachisl = {name: 'Начисления', sum: response.result.nachisl};
            $scope.forfeit = {name: 'Штрафы', sum: response.result.forfeit};
            $scope.payment = {name: 'Оплата', sum: response.result.payment};
        });
    };

    $scope.getBalanceForClient = function (id) {

        dataService.get('/balance/getTotalByClientJurId', {
            clientJurId: id,
            period: $scope.period
        }).then(function (response) {

            var foundItem = _.find($scope.data, function (item) {
                return item._id === id;
            });

            if (foundItem) {
                foundItem.balances = [];
                foundItem.balances = response.result;
            }

        });

    };

}