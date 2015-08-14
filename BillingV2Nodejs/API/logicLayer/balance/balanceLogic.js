var BalanceRepo = require('../../dataLayer/repositories/balance/balanceRepo'),
    validator = require(_helpersMongoosePath + 'validator'),
    balanceDefinition = require(_modelsPath + 'balances/balance'),
    mongoose = require('mongoose');


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