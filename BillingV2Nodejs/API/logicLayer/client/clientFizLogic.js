var ClientFizRepo = require('../../dataLayer/repositories/client/clientFizRepo');
var clientFizValidator = require(_helpersMongoosePath + 'validator');
var clientFizDefinition = require(_modelsPath + 'client/clientFiz');
var async = require('async');

var BalanceLogic = require('../../logicLayer/balance/balanceFizLogic');
var CalculationLogic = require('../../logicLayer/calculations/calculationFizLogic');
var TariffLogic = require('../../logicLayer/tariff/tariffFizLogic');
var mongoose = require('mongoose');
var _ = require('underscore');


exports.add = function (clientFiz, orgId, done) {

    clientFiz.organizationId = orgId;
    clientFizValidator('clientFiz', clientFizDefinition, clientFiz, function (validationRes) {
        if (validationRes.operationResult == 0) {
            ClientFizRepo.add(clientFiz, function (data) {
                done(data);
            });
        }
        else {
            done(validationRes);
        }
    });
};

exports.getAll = function (orgId, done) {
    ClientFizRepo.getAll(orgId, function (data) {
        done(data);
    });
};

exports.getAllByControllerId = function (ctrlId, done) {
    ClientFizRepo.getAllByCtrlId(ctrlId, function (data) {
        done(data);
    });
};

exports.get = function (id, done) {
    ClientFizRepo.get(id, function (data) {
        return done(data);
    });
};

exports.update = function (clientFiz, done) {
    clientFizValidator('clientFiz', clientFizDefinition, clientFiz, function (validationRes) {
        if (validationRes.operationResult == 0) {

            for (var i = 0; i < clientFiz.pipelines.length; i++)
                for (var j = 0; j < clientFiz.pipelines[i].counters.length; j++) {
                    if (clientFiz.pipelines[i].counters[j].isCounterNew)
                        clientFiz.pipelines[i].counters[j].isCounterNew = false;
                }

            ClientFizRepo.update(clientFiz, function (res) {
                return done(res);
            });
        }
        else {
            done(validationRes);
        }
    });
};

exports.sync = function (clientFizArr, done) {
    async.each(clientFizArr, function (clientFiz, callback) {
        clientFizValidator('clientFiz', clientFizDefinition, clientFiz, function (validationRes) {
            if (validationRes.operationResult == 0) {
                ClientFizRepo.update(clientFiz, function (res) {
                    return callback();
                });
            }
            else {
                callback();
            }
        });
    }, function () {
        done({operationResult: 0});
    });
};

exports.delete = function (id, done) {
    ClientFizRepo.delete(id, function (res) {
        return done(res);
    });
};

exports.getPeriods = function (done) {
    ClientFizRepo.getPeriods(function (res) {
        done({operationResult: 0, result: res.result});
    });
}

exports.search = function (searchTerm, period, user, done) {
    ClientFizRepo.search(searchTerm, period, user, function (res) {

        if (res.operationResult == 0) {
            async.each(res.result, function (client, callback) {
                BalanceLogic.getTotalByClientId(client._doc._id, period, function (balancesRes) {
                    client._doc.balances = balancesRes.result;
                    callback();
                });
            }, function () {
                return done(res);
            })
        } else {
            return done(res);
        }


    });
};

exports.updateClientCounter = function (body, userId, done) {

    if (body.withClear) {
        CalculationLogic.getByCounterId(body.counter._id, body.period, function (calcByCounterResp) {
            if (calcByCounterResp.operationResult === 0 && calcByCounterResp.result) {
                BalanceLogic.remove(calcByCounterResp.result._doc.balanceId, function (res) {
                    if (res.operationResult === 0) {
                        CalculationLogic.remove(calcByCounterResp.result._doc._id, function (res) {
                            if (res.operationResult === 0) {
                                ClientFizRepo.update(body.client, function (counterResp) {
                                    done(counterResp);
                                });
                            }
                        })
                    }
                });
            }
        });
        return;
    }

    var clientFiz = body.client;
    var pipeline = body.pipeline;
    var counter = body.counter;
    var period = body.period;

    var tariff = {
        water: 0,
        canal: 0
    };

    TariffLogic.getById(clientFiz.clientType.tariffId, function (tariffResp) {

        if (tariffResp.operationResult === 0)
            tariff = tariffResp.result;

        var waterCalcCubicMeters = 0;
        var canalCalcCubicMetersCount = 0;

        if (pipeline.sourceCounts != 2) {
            waterCalcCubicMeters = (counter.currentCounts - counter.lastCounts) * (pipeline.waterPercent / 100);
            canalCalcCubicMetersCount = (counter.currentCounts - counter.lastCounts) * (pipeline.canalPercent / 100);
        } else {
            waterCalcCubicMeters = pipeline.norm * (pipeline.waterPercent / 100);
            canalCalcCubicMetersCount = pipeline.norm * (pipeline.canalPercent / 100);
        }

        var waterSum = 0;
        var canalSum = 0;
        //if (counter.currentCounts > 0) {
        waterSum = waterCalcCubicMeters * tariff.water * -1;
        canalSum = canalCalcCubicMetersCount * tariff.canal * -1;
        //}

        var balanceId = mongoose.Types.ObjectId();
        var balanceTypeId = '55cdf641fb777624231ab6d9'; // ����������
        var balance = {
            _id: balanceId,
            balanceTypeId: balanceTypeId,
            clientId: clientFiz._id,
            sum: waterSum + canalSum,
            period: period,
            //�����
            date: new Date(),
            userId: userId
        };
        //��� �������� �� ��������
        var balanceAvg = null;//� CalculationLogic ���� �������� �� null

        //�����/�������
        var isShortage = false;
        var isShortageAvg = false;
        var shortageCubicMeters = 0;
        var shortageSum = 0;

        var calculation = {
            clientId: clientFiz._id,
            pipelineId: pipeline._id,
            counterId: counter._id,
            balanceId: balanceId,
            waterCubicMetersCount: waterCalcCubicMeters,
            canalCubicMetersCount: canalCalcCubicMetersCount,
            tariff: tariff,
            waterSum: waterSum,
            canalSum: canalSum,
            //������� �� ��������
            isShortage: isShortage, //�����/�������,
            shortageCubicMeters: shortageCubicMeters, //������� �3,
            shortageSum: shortageSum, //������� ��
            period: period,
            //�����
            date: new Date(),
            userId: userId,
            calculationType: 0 //0 - �� ��������, 1 - �� ��������,
        };
        var calculationAvg = null;//��� �������� �� ��������, � CalculationLogic ���� �������� �� null
        var minConsumption = clientFiz.clientType.minConsumption;

        //������� ���������� ��������� � ���� �������
        CalculationLogic.getByCounterId(counter._id, period, function (calcByCounterResp) {
            //���� ��������� ����, �� ���������
            if (calcByCounterResp.operationResult === 0 && calcByCounterResp.result) {
                var calcRes = calcByCounterResp.result._doc;
                balance._id = calcRes.balanceId;
                calculation._id = calcRes._id;
                calculation.balanceId = calcRes.balanceId;

                BalanceLogic.update(balance, function (balanceResp) {
                    CalculationLogic.update(calculation, function (calcResp) {
                        ClientFizRepo.update(clientFiz, function (counterResp) {
                            done(counterResp);
                        });
                    });
                });

            } else {//����� ��������� ����� ���������

                //������ �� "��������" - ����� ������ ������� �������� � "����" ��� ��� �������� ������������ ���-�� �������
                var previousCounterIndex = pipeline.counters.length - 2;

                if (previousCounterIndex > 0 && !counter.isPrevAvgCalculated) {

                    for (var i = 0; i < clientFiz.pipelines.length; i++)
                        for (var j = 0; j < clientFiz.pipelines[i].counters.length; j++) {
                            if (clientFiz.pipelines[i].counters[j]._id === counter._id) {
                                clientFiz.pipelines[i].counters[j].isPrevAvgCalculated = true;
                            }
                        }

                    var prevDate = pipeline.counters[previousCounterIndex].dateOfCurrentCounts;
                    var currentDate = counter.dateOfCurrentCounts;
                    //���-�� ���� ��� ��������
                    var daysDifferenceCount = 0;
                    if (currentDate && prevDate) {
                        currentDate = new Date(currentDate);
                        prevDate = new Date(prevDate);
                        daysDifferenceCount = currentDate.getDate() - prevDate.getDate();
                        var avgCountsPerMonth = pipeline.avg;

                        var year = prevDate.getFullYear();
                        var month = prevDate.getMonth() + 1;
                        //������ ���-�� ���� � ������, ����� ��������� ���� ������
                        var lastDayOfMonth = new Date(year, month, 0).getDate();
                        //������� �� ���� (�3)
                        var avgCountsPerDay = avgCountsPerMonth / lastDayOfMonth;
                        var avgCountsByPeriod = avgCountsPerDay * daysDifferenceCount;
                        var waterCount = avgCountsByPeriod * (pipeline.waterPercent / 100); //�3
                        var canalCount = avgCountsByPeriod * (pipeline.canalPercent / 100); //�3
                        var avgWaterSum = avgCountsByPeriod * waterCount * tariff.water * -1;
                        var avgCanalSum = avgCountsByPeriod * canalCount * tariff.canal * -1;

                        //
                        var balanceIdForAvg = mongoose.Types.ObjectId();
                        balanceAvg = {};
                        balanceAvg = _.extend(balanceAvg, balance);
                        balanceAvg._id = balanceIdForAvg;
                        balanceAvg.sum = avgWaterSum + avgCanalSum;

                        calculationAvg = {};
                        calculationAvg = _.extend(calculationAvg, calculation);
                        calculationAvg.counterId = null; //��� ��������
                        calculationAvg.balanceId = balanceIdForAvg;
                        calculationAvg.waterCubicMetersCount = waterCount;
                        calculationAvg.canalCubicMetersCount = canalCount;
                        calculationAvg.waterSum = avgWaterSum;
                        calculationAvg.canalSum = avgCanalSum;
                        calculationAvg.calculationType = 1; //0 - �� ��������, 1 - �� ��������,
                        calculationAvg.daysCountByAvg = daysDifferenceCount;

                        if (minConsumption) {
                            isShortageAvg = calculationAvg.waterCubicMetersCount < calculationAvg.minConsumption;
                            if (isShortageAvg) {
                                calculationAvg.shortageCubicMeters = minConsumption ? minConsumption - calculationAvg.waterCubicMetersCount : 0;
                                calculationAvg.shortageSum = calculationAvg.shortageCubicMeters * tariff.water;
                            }
                        }

                    }
                }


                if (minConsumption) {

                    isShortage = calculation.waterCubicMetersCount < calculation.minConsumption;
                    if (isShortage) {
                        calculation.shortageCubicMeters = minConsumption ? minConsumption - calculation.waterCubicMetersCount : 0;
                        calculation.shortageSum = calculation.shortageCubicMeters * tariff.water;
                    }
                }

                BalanceLogic.addMany([balanceAvg, balance], function (balanceAvgResp) {
                    if (balanceAvgResp.operationResult === 0) {
                        CalculationLogic.addMany([calculationAvg, calculation], function (calculationAvgResp) {
                            if (calculationAvgResp.operationResult === 0) {
                                ClientFizRepo.update(clientFiz, function (counterResp) {
                                    done(counterResp);
                                });
                            } else {
                                console.log('������ ������� � ��������� calculations');
                            }
                        });
                    } else {
                        console.log('������ ������� � ��������� balances');
                    }

                });
            }

        });


    });

};

exports.calculateByNorm = function (body, userId, done) {

    var clientFiz = body.client;

    var period = body.period;

    var withClear = body.withClear;

    if (withClear) {
        CalculationLogic.getByClientIdWithCounters(clientFiz._id, period, function (res) {
            if (res.operationResult == 0 && res.result && res.result.length > 0) {
                _.each(res.result, function (calc) {
                    BalanceLogic.remove(calc.balanceId, function (res) {
                        if (res.operationResult == 0) {
                            CalculationLogic.remove(calc._id, function (res) {

                            });
                        }
                    })
                });
            }
        })
    }


    var tariff = {
        water: 0,
        canal: 0
    };

    TariffLogic.getById(clientFiz.clientType.tariffId, function (tariffResp) {

        if (tariffResp.operationResult === 0)
            tariff = tariffResp.result;

        var waterCalcCubicMeters = clientFiz.norm * (clientFiz.waterPercent / 100);
        var canalCalcCubicMetersCount = clientFiz.norm * (clientFiz.canalPercent / 100);


        var waterSum = 0;
        var canalSum = 0;
        //if (counter.currentCounts > 0) {
        waterSum = waterCalcCubicMeters * tariff.water * -1;
        canalSum = canalCalcCubicMetersCount * tariff.canal * -1;
        //}

        var balanceId = mongoose.Types.ObjectId();
        var balanceTypeId = '55cdf641fb777624231ab6d9'; // ����������
        var balance = {
            _id: balanceId,
            balanceTypeId: balanceTypeId,
            clientId: clientFiz._id,
            sum: waterSum + canalSum,
            period: period,
            //�����
            date: new Date(),
            userId: userId
        };
        //��� �������� �� ��������
        var balanceAvg = null;//� CalculationLogic ���� �������� �� null

        //�����/�������


        var calculation = {
            clientId: clientFiz._id,
            pipelineId: null,
            counterId: null,
            balanceId: balanceId,
            waterCubicMetersCount: waterCalcCubicMeters,
            canalCubicMetersCount: canalCalcCubicMetersCount,
            tariff: tariff,
            waterSum: waterSum,
            canalSum: canalSum,
            //������� �� ��������
            isShortage: false, //�����/�������,
            shortageCubicMeters: 0, //������� �3,
            shortageSum: 0, //������� ��
            period: period,
            //�����
            date: new Date(),
            userId: userId,
            calculationType: 2 //0 - �� ��������, 1 - �� ��������, 2 - по норме
        };


        //������� ���������� ��������� � ���� �������
        CalculationLogic.getByClientId(clientFiz._id, period, function (calcByClientResp) {
                //���� ��������� ����, �� ���������
                if (calcByClientResp.operationResult === 0) {
                    if (calcByClientResp.result) {

                        var calcRes = calcByClientResp.result._doc;
                        balance._id = calcRes.balanceId;
                        calculation._id = calcRes._id;
                        calculation.balanceId = calcRes.balanceId;

                        BalanceLogic.update(balance, function (balanceResp) {
                            if (balanceResp.operationResult == 0) {
                                CalculationLogic.update(calculation, function (calcResp) {
                                    if (calcResp.operationResult == 0) {
                                        ClientFizRepo.update(clientFiz, function (clientResp) {
                                            if (clientResp.operationResult != 0) {
                                                CalculationLogic.remove(calculation._id, function (rem) {
                                                });
                                                BalanceLogic.remove(balance._id);
                                            }
                                            return done(clientResp);
                                        });
                                    }
                                    else {
                                        BalanceLogic.remove(balance._id, function (brem) {
                                        });
                                        return done(calcResp);
                                    }
                                });
                            }
                            else {
                                return done(balanceResp);
                            }
                        });

                    }
                    else {
                        BalanceLogic.add(balance, function (balanceResp) {
                            if (balanceResp.operationResult == 0) {
                                CalculationLogic.add(calculation, function (calcResp) {
                                    if (calcResp.operationResult == 0) {
                                        ClientFizRepo.update(clientFiz, function (clientResp) {
                                            return done(clientResp)
                                        });
                                    }
                                    else {
                                        return done(calcResp);
                                    }
                                });
                            }
                            else {
                                return done(balanceResp);
                            }
                        });
                    }
                } else {
                    return done(calcByClientResp);
                }

            }
        );
    });

};

exports.removeNormCalculations = function (client, done) {
    CalculationLogic.getByClientId(client._id, client.period, function (calcResp) {
        if (calcResp.operationResult == 0) {
            if (calcResp.result) {
                var calculation = calcResp.result;
                CalculationLogic.remove(calculation._id, function (remCalcResp) {
                    if (remCalcResp.operationResult == 0) {
                        BalanceLogic.remove(calculation.balanceId, function (remBalResp) {
                            ClientFizRepo.update(client, function (upClientResl) {
                                return done(upClientResl);
                            })
                        });
                    }
                    else
                    {
                        return done(remCalcResp);
                    }
                })
            }
            else {
                return done({operationResult: 1, result: "#calculation not found"});
            }
        }
        else
            return done(calcResp);
    })
}