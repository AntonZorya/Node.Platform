var BalanceRepo = require('../../dataLayer/repositories/balance/balanceFizRepo'),
    validator = require(_helpersMongoosePath + 'validator'),
    balanceDefinition = require(_modelsPath + 'balances/balanceFiz'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    PaymentDetailsRepo = require('../../dataLayer/repositories/payment/paymentFizRepo'),
    CalculationRepo = require('../../dataLayer/repositories/calculations/calculationFizRepo'),
    ForfeitDetailsRepo = require('../../dataLayer/repositories/forfeitDetails/forfeitDetailsFizRepo');


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

        if (balance != null)
            validator('balance', balanceDefinition, balance, function (validationRes) {
                if (validationRes.operationResult == 0) {
                    BalanceRepo.add(balance, function (data) {
                        if (balances.length - 1 === index)
                            return done(data);
                    });
                }
                else {
                    if (balances.length - 1 === index)
                        done(validationRes);
                }

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

exports.getAllBalance = function (period, done) {
    BalanceRepo.getGroupedSumBalance(period * 1, done);
};

exports.getByPeriodAndByClientId = function (dateFrom, dateTo, clientId, done) {
    BalanceRepo.getByPeriodAndByClientId(dateFrom, dateTo, clientId, function (data) {
        done(data);
    });
};

exports.getByPeriod = function (dateFrom, dateTo, done) {
    BalanceRepo.getByPeriod(dateFrom, dateTo, function (data) {
        done(data);
    });
};

exports.getTotalByClientId = function (clientId, period, done) {
    BalanceRepo.getByClientId(clientId, period, function (response) {

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





exports.getByPeriodAndClientIdWithDetails = function (clientId, period, done) {

    var balanceData = [];

    PaymentDetailsRepo.getByPeriodAndClientId(period, clientId, function (paymentsResp) {

        balanceData.push({
            name: "Оплата",
            data: paymentsResp.result
        });

        ForfeitDetailsRepo.getByPeriodAndClientId(period, clientId, function (forfeitResp) {
            balanceData.push({
                name: "Штрафы",
                data: forfeitResp.result
            });

            CalculationRepo.getByPeriodAndClientId(period, clientId, function (calculationsResp) {
                balanceData.push({
                    name: "Начисления",
                    data: calculationsResp.result
                });

                done({operationResult: 0, result: balanceData});

            });

        });


    });

};

exports.remove = function (balanceId, done) {
    BalanceRepo.remove(balanceId, done);
}



