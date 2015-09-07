var BalanceRepo = require('../../dataLayer/repositories/balance/balanceRepo'),
    validator = require(_helpersMongoosePath + 'validator'),
    balanceDefinition = require(_modelsPath + 'balances/balance'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    PaymentDetailsRepo = require('../../dataLayer/repositories/payment/paymentRepo'),
    CalculationRepo = require('../../dataLayer/repositories/calculations/calculationRepo'),
    ForfeitDetailsRepo = require('../../dataLayer/repositories/forfeitDetails/forfeitDetailsRepo');


exports.add = function (balance, done) {

    validator('balance', balanceDefinition, balance, function (validationRes) {
        if (validationRes.operationResult == 0)
            BalanceRepo.add(balance, function (data) {
                done(data);
            });
        else
            done(validationRes);
    });
};


exports.addMany = function (balances, done) {

    _.each(balances, function (balance, index) {

        validator('balance', balanceDefinition, balance, function (validationRes) {
            if (validationRes.operationResult == 0) {
                BalanceRepo.add(balance, function (data) {
                    if (balances.length - 1 === index)
                        done(data);
                });
            }
            else
                done(validationRes);
        });
    });
};

exports.update = function (balance, done) {
    validator('balance', balanceDefinition, balance, function (validationRes) {
        if (validationRes.operationResult == 0) {
            BalanceRepo.update(balance, function (res) {
                return done(res);
            });
        }
        else {
            done(validationRes);
        }
    });
};

exports.getById = function (id, done) {
    BalanceRepo.getById(id, function (data) {
        done(data);
    });
};

exports.getByPeriodAndByClientJurId = function (dateFrom, dateTo, clientJurId, done) {
    BalanceRepo.getByPeriodAndByClientJurId(dateFrom, dateTo, clientJurId, function (data) {
        done(data);
    });
};

exports.getByPeriod = function (dateFrom, dateTo, done) {
    BalanceRepo.getByPeriod(dateFrom, dateTo, function (data) {
        done(data);
    });
};

exports.getAllBalance = function (done) {
    BalanceRepo.getAllBalance(function (data) {
        done(data);
    });
};

exports.getTotalByClientJurId = function (clientJurId, done) {
    BalanceRepo.getByClientJurId(clientJurId, function (response) {

        var balances = response.result;

        var groupedBalances = _(balances).groupBy(function (bal) {
            return bal.balanceTypeId.name;
        });

        var balancesRes = [];

        for (var key in groupedBalances) {

            var clientName = key;
            var balanceByClient = {
                name: clientName,
                sum: 0
            };

            _.each(groupedBalances[key], function (bal) {
                balanceByClient.sum = balanceByClient.sum + bal.sum;
            });

            balancesRes.push(balanceByClient);
        }

        done({operationResult: 0, result: balancesRes});
    });
};


exports.getByPeriodAndClientIdWithDetails = function (clientJurId, period, done) {

    var balanceData = [];

    PaymentDetailsRepo.getByPeriodAndClientId(period, clientJurId, function (paymentsResp) {

        balanceData.push({
            name: "Оплата",
            data: paymentsResp.result
        });

        ForfeitDetailsRepo.getByPeriodAndClientId(period, clientJurId, function (forfeitResp) {
            balanceData.push({
                name: "Штрафы",
                data: forfeitResp.result
            });

            CalculationRepo.getByPeriodAndClientId(period, clientJurId, function (calculationsResp) {
                balanceData.push({
                    name: "Начисления",
                    data: calculationsResp.result
                });

                done({operationResult: 0, result: balanceData});

            });

        });


    });


};





