var PaymentRepo = require('../../dataLayer/repositories/payment/paymentRepo'),
    validator = require(_helpersMongoosePath + 'validator'),
    paymentDefinition = require(_modelsPath + 'paymentDetails/paymentDetails'),
    mongoose = require('mongoose'),
    BalanceLogic = require('../../logicLayer/balance/balanceLogic');
BalanceTypeRepo = require('../../dataLayer/repositories/balance/balanceTypeRepo');


exports.add = function (payment, done) {

    var balanceId = mongoose.Types.ObjectId();

    var balanceTypeId = '55cdf61a2a5acf103fc2b6ed'; // Оплата
    var balance = {
        _id: balanceId,
        balanceTypeId: balanceTypeId,
        clientJurId: payment.clientId,
        date: payment.date,
        sum: payment.sum,
        isDeleted: false,
        createDateTime: new Date()
    };

    var paymentDetails = {
        balanceId: balanceId,
        receiptNumber: payment.receiptNumber
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