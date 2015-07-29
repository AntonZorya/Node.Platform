billingApplication.controller('juridicalController', ['$scope', 'dataService', 'toastr', 'printSvc', '$templateCache', 'modalSvc', juridicalController]);

function juridicalController($scope, dataService, toastr, printSvc, $templateCache, modalSvc) {

    $scope.searchTerm = '';
    $scope.data = [];
    $scope.selectedItem = {};

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
                toastr.success('', 'Значение успешно изменено');
                console.log(response.result);
            });
        }
        else {
            toastr.warning('Текущие показания должны быть больше или равны последним!', 'Предупреждение');
        }
    };

    //TODO: вынести в отдельный контроллер
    //payment
    $scope.isShowModalPayment = false;
    $scope.payment = {};
    $scope.paymentClientName = '';
    $scope.enteredSum = 0;
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
        dataService.post('/clientJur/paymentAdd', $scope.payment).then(function (response) {
            if (response.operationResult === 0) {
                $scope.paymentResult = response.result;
                printSvc.printHtml($('#paymentInvoice')[0].innerHTML);
            }
        });
    };
    //!payment

    $scope.editTechData = function () {
        modalSvc.showModal('/app/operator/juridical/editTechData.html', 'editTechDataModal', $scope);
    };


}


