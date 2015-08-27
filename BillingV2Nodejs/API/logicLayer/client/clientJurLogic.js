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

exports.updateClientCounter = function (body, done) {

    var counter = body.counter;

    ClientJurRepo.get(body.clientId, function (clientJur) {

        var tariff = clientJur.result.clientType.tariffId;

        var waterCalcCubicMeters = (counter.currentCounts - counter.lastCounts) * (clientJur.result.waterPercent / 100);
        var canalCalcCubicMetersCount = (counter.currentCounts - counter.lastCounts) * (clientJur.result.canalPercent / 100);

        var waterSum = 0;
        var canalSum = 0;
        if (counter.currentCounts > 0) {
            waterSum = waterCalcCubicMeters * tariff.water;
            canalSum = canalCalcCubicMetersCount * tariff.canal;
        }

        var balanceId = mongoose.Types.ObjectId();
        var balanceTypeId = '55cdf641fb777624231ab6d9'; // начисление
        var balance = {
            _id: balanceId,
            balanceTypeId: balanceTypeId,
            clientJurId: body.clientId,
            date: new Date(),
            sum: (waterSum + canalSum) * -1
        };

        var calculation = {
            balanceId: balanceId,
            waterCalcCubicMeters: waterCalcCubicMeters,
            canalCalcCubicMetersCount: canalCalcCubicMetersCount,
            tariff: tariff,
            waterSum: waterSum,
            canalSum: canalSum
        };

        BalanceLogic.add(balance, function (balanceResp) {
            CalculationLogic.add(calculation, function (calcResp) {
                ClientJurRepo.updateClientCounter(body, function (counterResp) {
                    done(counterResp);
                });
            });
        });


    });


};

