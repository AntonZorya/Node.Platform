var PaymentRepo = require('../../dataLayer/repositories/payment/paymentRepo'),
    validator = require(_helpersMongoosePath + 'validator'),
    paymentDefinition = require(_modelsPath + 'payment/payment'),
    mongoose = require('mongoose');


exports.add = function (payment, done) {

    validator('payment', paymentDefinition, payment, function (validationRes) {
        if (validationRes.operationResult == 0)
            PaymentRepo.add(payment, function (data) {
                done(data);
            });
        else
            done(validationRes);
    });
};

exports.getByClientId = function (clientId, done) {
    PaymentRepo.getByClientId(clientId, function (data) {
        done(data);
    });
};

exports.getByPeriod = function (dateFrom, dateTo, done) {
    PaymentRepo.getByPeriod(dateFrom, dateTo, function (data) {
        done(data);
    });
};