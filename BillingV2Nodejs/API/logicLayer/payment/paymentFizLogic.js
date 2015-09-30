var PaymentRepo = require('../../dataLayer/repositories/payment/paymentFizRepo'),
    validator = require(_helpersMongoosePath + 'validator'),
    paymentDefinition = require(_modelsPath + 'paymentDetails/paymentDetailsFiz'),
    mongoose = require('mongoose'),
    BalanceLogic = require('../../logicLayer/balance/balanceFizLogic');
BalanceTypeRepo = require('../../dataLayer/repositories/balance/balanceTypeRepo');


exports.add = function (payment, userId, done) {

    var balanceId = mongoose.Types.ObjectId();
    var period = payment.period;

    var balanceTypeId = '55cdf61a2a5acf103fc2b6ed'; // Оплата
    var balance = {
        _id: balanceId,
        balanceTypeId: balanceTypeId,
        clientId: payment.clientId,
        sum: payment.sum,

        period: period,
        //аудит
        date: new Date(),
        userId: userId

    };

    var paymentDetails = {
        balanceId: balanceId,
        receiptNumber: payment.receiptNumber,
        clientId: payment.clientId,

        period: period,
        //аудит
        date: new Date(),
        userId: userId
    };

    BalanceLogic.add(balance, function (response) {

        validator('paymentDetailsFiz', paymentDefinition, paymentDetails, function (validationRes) {
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