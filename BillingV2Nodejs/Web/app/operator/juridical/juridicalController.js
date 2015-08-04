billingApplication.controller('juridicalController', ['$scope', 'dataService', 'toastr', 'printSvc', '$templateCache', 'modalSvc', juridicalController]);

function juridicalController($scope, dataService, toastr, printSvc, $templateCache, modalSvc) {

    $scope.searchTerm = '';
    $scope.data = [];
    $scope.selectedItem = {};
    $scope.streets = [];
    $scope.counterMarks = [];
    $scope.ksks = [];
    $scope.tariffs = [];


    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '2015:2020'
    };

    $scope.search = function () {
        dataService.get('/clientJur/search', {searchTerm: $scope.searchTerm}, null).then(function (response) {
            $scope.data = response.result;
        });
    };

    $scope.showCounters = function (item) {
        item.isShowCounters = !item.isShowCounters;
        $scope.selectedItem = item;
    };

    $scope.updateCounter = function (clientId, counter) {

        if (counter.currentCounts >= counter.lastCounts) {
            if (!counter.hasProblem)
                counter.problemDescription = '';

            dataService.post('/clientJur/updateClientCounter', {
                clientId: clientId,
                counter: counter
            }).then(function (response) {
                toastr.success('', 'Данные успешно сохранены');
                console.log(response.result);
            });
        }
        else {
            toastr.error('Текущие показания должны быть больше или равны последним!', 'Данные не сохранены');
        }
    };

    //TODO: вынести в отдельный контроллер
    //payment
    $scope.isShowModalPayment = false;
    $scope.payment = {};
    $scope.paymentClientName = '';
    $scope.enteredSum = 0;
    $scope.enteredReceiptNumber = null;
    $scope.showModalPayment = function (item) {

        $scope.paymentClientName = item.name;

        $scope.payment = {
            clientId: item._id,
            personType: 1,
            //sum: $scope.enteredSum,
            date: new Date()
        };

        $scope.isShowModalPayment = true;
        $scope.enteredSum = 0;
    };

    $scope.closeModalPayment = function () {
        $scope.isShowModalPayment = false;
    };

    $scope.paymentResult = {};
    $scope.sendPayment = function () {
        $scope.payment.sum = $scope.enteredSum;
        $scope.payment.receiptNumber = $scope.enteredReceiptNumber;
        dataService.post('/payment/paymentAdd', $scope.payment).then(function (response) {
            if (response.operationResult === 0) {
                $scope.paymentResult = response.result;
                $scope.print();
            }
        });
    };
    //!payment

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

    $scope.editTechData = function () {
        modalSvc.showModal('/app/operator/juridical/editTechData.html', 'editTechDataModal', $scope);
    };

    $scope.editPassportData = function () {
        modalSvc.showModal('/app/operator/juridical/editPassportData.html', 'editPassportDataModal', $scope);
    };

    //streets
    $scope.getStreets = function () {
        dataService.get('/streets').then(function (response) {
            $scope.streets = response.result;
        });
    };
    $scope.getStreets();

    //counterMarks
    $scope.getCounterMarks = function () {
        dataService.get('/counterMarks').then(function (response) {
            $scope.counterMarks = response.result;
        });
    };
    $scope.getCounterMarks();

    //ksk
    $scope.getKsks = function () {
        dataService.get('/ksks').then(function (response) {
            $scope.ksks = response.result;
        });
    };
    $scope.getKsks();

    //tariffs
    $scope.getTariffs = function () {
        dataService.get('/tariffs').then(function (response) {
            $scope.tariffs = response.result;
        });
    };
    $scope.getTariffs();


    $scope.getClientPaymentHistory = function () {
        modalSvc.showModal('/app/operator/juridical/clientPaymentHistory.html', 'clientPaymentHistoryModal', $scope);
    };

    $scope.byAverage = function (counter) {
        if (counter.isCountsByAvg == true) {
            var avg = 3; //TODO: расчеты "по среднему"
            counter.currentCounts = counter.lastCounts + avg;
            counter.countsByAvg = avg;
        } else {
            counter.currentCounts = 0;
            counter.countsByAvg = 0;
        }
    }


}



