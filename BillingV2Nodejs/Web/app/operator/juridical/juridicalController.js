billingApplication.controller('juridicalController', ['$scope', 'dataService', 'toastr', 'printSvc', '$templateCache', 'modalSvc', '$rootScope', juridicalController]);

function juridicalController($scope, dataService, toastr, printSvc, $templateCache, modalSvc, $rootScope) {

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

    $scope.period = {};
    $scope.periods = [];

    $scope.getPeriods = function () {
        dataService.get('/clientJur/getPeriods').then(function (response) {
            response.result.forEach(function(item){
                item = item.toString();
                $scope.periods.unshift({value: item});
            });
            var date = new Date();
            var month = date.getMonth() + 1;
            $scope.period.value = date.getFullYear().toString() + (month < 10 ? '0' + month.toString(): month.toString());
        });
    };
    $scope.getPeriods();

    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '2010:2020'
    };

    $scope.search = function () {
        dataService.get('/clientJur/search', {
            searchTerm: $scope.searchTerm,
            period: $scope.period.value
        }, null).then(function (response) {
            $scope.data = response.result;
        });
    };

    $scope.refresh = function () {
        $scope.search();
        $scope.getAllBalance();
    };

    $scope.showCounters = function (item) {
        item.isShowCounters = !item.isShowCounters;
        $scope.selectedItem = item;

        if (item.isShowCounters)
            $scope.getBalanceForClient(item._id);
    };

    $scope.updateClient = function (client, counter, pipeline, withClear) {

        if (withClear) {
            if (confirm('#Вы действительно хотите очистить текущие показания?')) {
                counter.currentCounts = null;
                counter.dateOfCurrentCounts = null;
            } else {
                return;
            }
        } else {
            if (counter.dateOfCurrentCounts == null) { //TODO: переделать на валидацию, если нужно
                toastr.error('Дата текущих показаний обязательное поле!', 'Данные не сохранены');
                return;
            } else {
                if (counter.currentCounts >= counter.lastCounts) {
                    if (!counter.hasProblem)
                        counter.problemDescription = '';
                } else {
                    toastr.error('Текущие показания должны быть больше или равны последним!', 'Данные не сохранены');
                    return;
                }
            }
        }

        var body = {
            client: client,
            pipeline: pipeline,
            counter: counter,
            period: $scope.period.value
        };

        dataService.post('/clientJur/updateClientCounter', body).then(function (response) {
            if (response.operationResult === 0) {
                toastr.success('', 'Данные успешно сохранены');
                counter.isCounterNew = false;
                $scope.getBalanceForClient(client._id);
                $scope.getAllBalance();
            } else {
                toastr.error('', 'Произошла ошибка');
            }
        });

    };


    //TODO: желательно вынести в отдельный контроллер
    //payment
    $scope.isShowModalPayment = false;
    $scope.payment = {};
    $scope.paymentClientName = '';
    $scope.enteredSum = null;
    $scope.enteredReceiptNumber = null;
    $scope.showModalPayment = function (item) {

        $scope.paymentClientName = item.name;

        $scope.payment = {
            clientId: item._id,
            personType: 1,
            //sum: $scope.enteredSum,
            date: new Date(),
            period: $scope.period.value,
            user: $rootScope.user
        };

        $scope.isShowModalPayment = true;
        $scope.enteredSum = null;
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
                $scope.getBalanceForClient($scope.payment.clientId);
                $scope.getAllBalance();
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


    $scope.getControllers = function () {
        dataService.get('/controllers').then(function (response) {
            $scope.controllers = response.result;
        });
    };
    $scope.getControllers();


    $scope.getClientTypes = function () {
        dataService.get('/clientTypes').then(function (response) {
            $scope.clientTypes = response.result;
        });
    };
    $scope.getClientTypes();


    //tariffs
    $scope.getTariffs = function () {
        dataService.get('/tariffs').then(function (response) {
            $scope.tariffs = response.result;
        });
    };
    $scope.getTariffs();


    $scope.getClientBalanceDetails = function () {
        modalSvc.showModal('/app/operator/juridical/clientPaymentHistory.html', 'clientPaymentHistoryModal', $scope);
    };

    $scope.byAverage = function (pipeline) {

        if (!pipeline.avg && pipeline.isCountsByAvg === true)
            alert('Нет данных "По среднему" ');
        else {
            var foundCounter = _.find(pipeline.counters, function (counter) {
                return counter.isActive === true;
            });

            if (!foundCounter)
                alert("Нет активного счетчика");

            else if (foundCounter && pipeline.isCountsByAvg === true) {
                foundCounter.currentCounts = foundCounter.lastCounts * 1 + pipeline.avg * 1;
                //counter.countsByAvg = avg;
            }
            else if (foundCounter && pipeline.isCountsByAvg === false) {
                foundCounter.currentCounts = 0;
            }
        }

    };


    $scope.fined = function () {
        modalSvc.showModal('/app/operator/juridical/forfeit.html', 'forfeitModal', $scope);
    };


    $scope.getAllBalance = function () {
        //TODO: оптимизировать - посчитать на сервере и вернуть на клиента только суммы по всем клиентам
        dataService.get('/balance/getAllBalance', {period: $scope.period.value}).then(function (response) {

            var groupedBalances = _(response.result).groupBy(function (bal) {
                return bal.balanceTypeId.name;
            });

            $scope.nachisl = {
                name: 'Начисления',
                sum: 0
            };
            _.each(groupedBalances['Начисление'], function (bal) {
                $scope.nachisl.sum = $scope.nachisl.sum + bal.sum;
            });

            $scope.forfeit = {
                name: 'Штрафы',
                sum: 0
            };
            _.each(groupedBalances['Штраф'], function (bal) {
                $scope.forfeit.sum = $scope.forfeit.sum + bal.sum;
            });

            $scope.payment = {
                name: 'Оплата',
                sum: 0
            };
            _.each(groupedBalances['Оплата'], function (bal) {
                $scope.payment.sum = $scope.payment.sum + bal.sum;
            });

        });
    };
    $scope.getAllBalance();

    $scope.getBalanceForClient = function (id) {

        dataService.get('/balance/getTotalByClientJurId', {
            clientJurId: id,
            period: $scope.period.value
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



