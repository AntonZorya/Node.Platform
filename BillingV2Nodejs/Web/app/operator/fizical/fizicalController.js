billingApplication.controller('fizicalController', ['$scope', 'dataService', 'toastr', 'printSvc', '$templateCache', 'modalSvc', '$rootScope', fizicalController]);

function fizicalController($scope, dataService, toastr, printSvc, $templateCache, modalSvc, $rootScope) {

    var self = this;

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

    $scope.period = {value: ''};
    $scope.periods = [];

    $scope.getPeriods = function () {
        dataService.get('/clientFiz/getPeriods').then(function (response) {
            response.result.forEach(function (item) {
                item = item.toString();
                $scope.periods.unshift({value: item});
            });
            var date = new Date();
            var month = date.getMonth() + 1;
            var per = {value: date.getFullYear().toString() + (month < 10 ? '0' + month.toString() : month.toString())};
            $scope.period = per in $scope.periods ? per : $scope.periods[0];
            $scope.getAllBalance();
        });
    };
    $scope.getPeriods();

    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '2010:2020'
    };

    $scope.search = function () {
        dataService.get('/clientFiz/search', {
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
        item.pipelines.forEach(function (pipeline) {
            pipeline.checkAvg = pipeline.sourceCounts == 1;
            pipeline.checkNorm = pipeline.sourceCounts == 2;
        });
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
                pipeline.checkAvg = false;
                pipeline.checkNorm = false;
                pipeline.sourceCounts = 0;
            } else {
                return;
            }
        } else if (pipeline.sourceCounts != 2) {
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
            period: $scope.period.value,
            withClear: withClear
        };

        dataService.post('/clientFiz/updateClientCounter', body).then(function (response) {
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
        dataService.post('/paymentfiz/paymentAdd', $scope.payment).then(function (response) {
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

    $scope.editClient = function () {
        modalSvc.showModal('/app/operator/fizical/editFizClient.html', 'editFizClientModal', $scope);
    };

    $scope.editPassportData = function () {
        modalSvc.showModal('/app/operator/fizical/editPassportData.html', 'editPassportDataModal', $scope);
    };

    $scope.addClient = function () {
        modalSvc.showModal('/app/operator/fizical/addFizClient.html', 'addFizClientModal', $scope);
    }

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
        dataService.get('/controllerFizs').then(function (response) {
            $scope.controllers = response.result;
        });
    };
    $scope.getControllers();


    $scope.getClientTypes = function () {
        dataService.get('/clientTypesFiz').then(function (response) {
            $scope.clientTypes = response.result;
        });
    };
    $scope.getClientTypes();


    //tariffs
    $scope.getTariffs = function () {
        dataService.get('/tariffsFiz').then(function (response) {
            $scope.tariffs = response.result;
        });
    };
    $scope.getTariffs();


    $scope.getClientBalanceDetails = function () {
        modalSvc.showModal('/app/operator/fizical/clientPaymentHistory.html', 'clientPaymentHistoryModal', $scope);
    };

    $scope.byAverage = function (pipeline) {
        if (!pipeline.avg) {
            alert('Нет данных "По среднему" ');
            pipeline.checkAvg = false;
        } else {
            var foundCounter = _.find(pipeline.counters, function (counter) {
                return counter.isActive === true;
            });

            if (!foundCounter)
                alert("Нет активного счетчика");

            else if (foundCounter) {
                if (pipeline.checkAvg) {
                    foundCounter.currentCounts = foundCounter.lastCounts * 1 + pipeline.avg * 1;
                    pipeline.sourceCounts = 1;
                } else {
                    foundCounter.currentCounts = 0;
                    pipeline.sourceCounts = 0;
                }
            }
        }
    };

    $scope.clickByNorm = function (clientFiz) {
        clientFiz.checkByNorm = !clientFiz.checkByNorm;
        $scope.byNorm(clientFiz);
    }

    $scope.byNorm = function (clientFiz) {

        if (!clientFiz.norm) {
            alert('Нет данных по "По норме"');
            clientFiz.checkByNorm = false;
            return;
        }

        if (clientFiz.checkByNorm) {

            dataService.get('/clientFiz/hasCalcWithCounter', {
                clientId: clientFiz._id,
                period: $scope.period.value
            }).then(function (res) {
                if (res.result) {
                    if (confirm('#Удалить текущие начисления по вводу?')) {
                        self.calculateByNorm(clientFiz, true);
                    }
                    else {
                        self.calculateByNorm(clientFiz, false);
                    }
                }
                else {
                    self.calculateByNorm(clientFiz, false);
                }
            });
        }
        else {
            self.removeCalculateByNorm(clientFiz);
        }
    }


    this.calculateByNorm = function (client, withClear) {

        var body = {
            client: client,
            period: $scope.period.value,
            withClear: withClear
        };

        dataService.post('/clientFiz/calculateByNorm', body).then(function (response) {
            if (response.operationResult === 0) {
                toastr.success('', 'Данные успешно сохранены');
                $scope.getBalanceForClient(client._id);
                $scope.getAllBalance();
            } else {
                toastr.error('', 'Произошла ошибка');
            }
        });
    }

    this.removeCalculateByNorm = function (client) {
        dataService.post('/clientFiz/removeNormCalculations', {client: client}).then(function (response) {
            if (response.operationResult === 0) {
                toastr.success('', 'Данные успешно удалены');
                $scope.getBalanceForClient(client._id);
                $scope.getAllBalance();
            } else {
                toastr.error('', 'Произошла ошибка');
            }
        });
    }


    $scope.fined = function () {
        modalSvc.showModal('/app/operator/fizical/forfeit.html', 'forfeitModal', $scope);
    };


    $scope.getAllBalance = function () {
        dataService.get('/balanceFiz/getAllBalance', {period: $scope.period.value}).then(function (response) {
            $scope.nachisl = {name: 'Начисления', sum: response.result.nachisl};
            $scope.forfeit = {name: 'Штрафы', sum: response.result.forfeit};
            $scope.payment = {name: 'Оплата', sum: response.result.payment};
        });
    };

    $scope.getBalanceForClient = function (id) {

        dataService.get('/balanceFiz/getTotalByClientId', {
            clientId: id,
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

    $scope.updateClientBalance = function (clientId) {
        var client = _.find($scope.data, {_id: clientId});
        if (client) {
            client.pipelines.forEach(function (pipeline) {
                pipeline.counters.forEach(function (counter) {
                    if (counter.isActive && counter.currentCounts && counter.dateOfCurrentCounts) {
                        dataService.post('/clientFiz/updateClientCounter', {
                            client: client,
                            pipeline: pipeline,
                            counter: counter,
                            period: $scope.period.value
                        }).then(function (response) {
                            if (response.operationResult === 0) {
                                //toastr.success('', 'Данные успешно сохранены');
                                counter.isCounterNew = false;
                                $scope.getBalanceForClient(client._id);
                                $scope.getAllBalance();
                            } else {
                                toastr.error('', 'Произошла ошибка');
                            }
                        });
                    }
                });
            });
        }
    };

}



