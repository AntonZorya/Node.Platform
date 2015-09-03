var ClientJurRepo = require('../../dataLayer/repositories/client/clientJurRepo');
var clientJurValidator = require(_helpersMongoosePath + 'validator');
var clientJurDefinition = require(_modelsPath + 'client/clientJur');
var async = require('async');

var BalanceLogic = require('../../logicLayer/balance/balanceLogic');
var CalculationLogic = require('../../logicLayer/calculations/calculationLogic');
mongoose = require('mongoose');

exports.add = function (clientJur, orgId, done) {

    clientJur.organizationId = orgId;
    clientJurValidator('clientJur', clientJurDefinition, clientJur, function (validationRes) {
        if (validationRes.operationResult == 0) {
            ClientJurRepo.add(clientJur, function (data) {
                done(data);
            });
        }
        else {
            done(validationRes);
        }
    });
};

exports.getAll = function (orgId, done) {
    ClientJurRepo.getAll(orgId, function (data) {
        done(data);
    });
};

exports.getAllByControllerId = function (ctrlId, done) {
    ClientJurRepo.getAllByCtrlId(ctrlId, function (data) {
        done(data);
    });
};

exports.get = function (id, done) {
    ClientJurRepo.get(id, function (data) {
        return done(data);
    });
};

exports.update = function (clientJur, done) {
    clientJurValidator('clientJur', clientJurDefinition, clientJur, function (validationRes) {
        if (validationRes.operationResult == 0) {

            for (var i = 0; i < clientJur.pipelines.length; i++)
                for (var j = 0; j < clientJur.pipelines[i].counters.length; j++) {
                    if (clientJur.pipelines[i].counters[j].isCounterNew)
                        clientJur.pipelines[i].counters[j].isCounterNew = false;
                }

            ClientJurRepo.update(clientJur, function (res) {
                return done(res);
            });
        }
        else {
            done(validationRes);
        }
    });
};

exports.sync = function (clientJurArr, done) {
    async.each(clientJurArr, function (clientJur, callback) {
        clientJurValidator('clientJur', clientJurDefinition, clientJur, function (validationRes) {
            if (validationRes.operationResult == 0) {
                ClientJurRepo.update(clientJur, function (res) {
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
    ClientJurRepo.delete(id, function (res) {
        return done(res);
    });
};

exports.search = function (searchTerm, done) {
    ClientJurRepo.search(searchTerm, function (res) {
        return done(res);
    });
};

exports.updateClientCounter = function (body, userId, done) {

    var clientJur = body.client;
    var pipeline = body.pipeline;
    var counter = body.counter;
    var period = body.period;

    var tariff = clientJur.clientType.tariffId;
    var waterCalcCubicMeters = 0;
    var canalCalcCubicMetersCount = 0;

    waterCalcCubicMeters = (counter.currentCounts - counter.lastCounts) * (pipeline.waterPercent / 100);
    canalCalcCubicMetersCount = (counter.currentCounts - counter.lastCounts) * (pipeline.canalPercent / 100);


    var waterSum = 0;
    var canalSum = 0;
    //if (counter.currentCounts > 0) {
    waterSum = waterCalcCubicMeters * tariff.water;
    canalSum = canalCalcCubicMetersCount * tariff.canal;
    //}

    var balanceId = mongoose.Types.ObjectId();
    var balanceTypeId = '55cdf641fb777624231ab6d9'; // начисление
    var balance = {
        _id: balanceId,
        balanceTypeId: balanceTypeId,
        clientJurId: clientJur._id,
        sum: (waterSum + canalSum) * -1,
        period: period,
        //аудит
        date: new Date(),
        userId: userId
    };

    //добор/недобор
    var isShortage = false;
    var shortageCubicMeters = 0;
    var shortageSum = 0;
    var minConsumption = clientJur.clientType.minConsumption;
    if (minConsumption) {
        isShortage = waterCalcCubicMeters < minConsumption;
        if (isShortage) {
            shortageCubicMeters = minConsumption ? minConsumption - waterCalcCubicMeters : 0;
            shortageSum = shortageCubicMeters * tariff.water;
        }
    }

    var calculation = {
        clientJurId: clientJur._id,
        pipelineId: pipeline._id,
        counterId: counter._id,
        balanceId: balanceId,
        waterCubicMetersCount: waterCalcCubicMeters,
        canalCubicMetersCount: canalCalcCubicMetersCount,
        tariff: tariff,
        waterSum: waterSum,
        canalSum: canalSum,

        //считаем от минимума
        isShortage: isShortage, //добор/недобор,
        shortageCubicMeters: shortageCubicMeters, //недобор м3,
        shortageSum: shortageSum, //недобор тг

        period: period,
        //аудит
        date: new Date(),
        userId: userId

    };

    //находим предыдущие показания в этом периоде
    CalculationLogic.getByCounterId(counter._id, period, function (calcByCounterResp) {
        //если показания есть, то обновляем
        if (calcByCounterResp.operationResult === 0 && calcByCounterResp.result) {
            var calcRes = calcByCounterResp.result._doc;
            balance._id = calcRes.balanceId;
            calculation._id = calcRes._id;
            calculation.balanceId = calcRes.balanceId;

            BalanceLogic.update(balance, function (balanceResp) {
                CalculationLogic.update(calculation, function (calcResp) {
                    ClientJurRepo.update(clientJur, function (counterResp) {
                        done(counterResp);
                    });
                });
            });

        } else {//иначе добавляем новые показания
            BalanceLogic.add(balance, function (balanceResp) {
                CalculationLogic.add(calculation, function (calcResp) {
                    ClientJurRepo.update(clientJur, function (counterResp) {
                        done(counterResp);
                    });
                });
            });
        }

    });


};

