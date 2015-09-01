var PaymentRepo = require('../../dataLayer/repositories/payment/paymentRepo'),
    validator = require(_helpersMongoosePath + 'validator'),
    paymentDefinition = require(_modelsPath + 'paymentDetails/paymentDetails'),
    mongoose = require('mongoose'),
    BalanceLogic = require('../../logicLayer/balance/balanceLogic');
BalanceTypeRepo = require('../../dataLayer/repositories/balance/balanceTypeRepo');


exports.add = function (payment, done) {

    var balanceId = mongoose.Types.ObjectId();
    var period = payment.period;

    var balanceTypeId = '55cdf61a2a5acf103fc2b6ed'; // Оплата
    var balance = {
        _id: balanceId,
        balanceTypeId: balanceTypeId,
        clientJurId: payment.clientId,
        sum: payment.sum,

        period: period,
        //аудит
        date: new Date(),
        userId: "557f15402af16cc42c2cc351" //TODO: вытаскивать текущего юзера

    };

    var paymentDetails = {
        balanceId: balanceId,
        receiptNumber: payment.receiptNumber,
        clientJurId: payment.clientId,

        period: period,
        //аудит
        date: new Date(),
        userId: "557f15402af16cc42c2cc351" //TODO: вытаскивать текущего юзера
    };

    BalanceLogic.add(balance, function (response) {

        validator('paymentDetails', paymentDefinition, paymentDetails, function (validationRes) {
            if (validationRes.operationResult == 0) {
                PaymentRepo.add(paymentDetails, function (data) {
                    done(data);
                });
            }
            else
                done(validationRes);
        });
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