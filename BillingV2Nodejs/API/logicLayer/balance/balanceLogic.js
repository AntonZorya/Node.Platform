var BalanceRepo = require('../../dataLayer/repositories/balance/balanceRepo'),
    validator = require(_helpersMongoosePath + 'validator'),
    balanceDefinition = require(_modelsPath + 'balances/balance'),
    mongoose = require('mongoose'),
    _ = require('underscore');


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

exports.getBytId = function (id, done) {
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

exports.getByClientJurId = function (clientJurId, done) {
    BalanceRepo.getByClientJurId(clientJurId, function (response) {

        var balances = response.result;

        var groupedBalances = _(balances).groupBy(function (bal) {
            return bal.balanceTypeId;
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





