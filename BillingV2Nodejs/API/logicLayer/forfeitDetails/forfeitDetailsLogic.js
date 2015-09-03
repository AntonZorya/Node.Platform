var forfeitRepo = require('../../dataLayer/repositories/forfeitDetails/forfeitDetailsRepo');
var validator = require(_helpersMongoosePath + 'validator');
var forfeitDefinition = require(_modelsPath + 'forfeitDetails/forfeitDetails');
var balanceLogic = require('../../logicLayer/balance/balanceLogic');
var mongoose = require('mongoose');

exports.add = function (forfeitDetails, userId, done) {


    var balanceId = mongoose.Types.ObjectId();
    var balanceTypeId = '55cdf5c5bd2c5768423c5796';//штраф
    var period = forfeitDetails.period;

    var forfeitDetailsForDb = {
        balanceId: balanceId,
        comment: forfeitDetails.comment,
        files: forfeitDetails.files,
        clientJurId: forfeitDetails.clientId,

        period: period,
        //аудит
        date: new Date(),
        userId: userId

    };

    var balance = {
        _id: balanceId,
        balanceTypeId: balanceTypeId,
        clientJurId: forfeitDetails.clientId,
        sum: (forfeitDetails.sum) * (-1),

        period: period,
        //аудит
        date: new Date(),
        userId: userId
    };

    balanceLogic.add(balance, function (response) {

        validator('forfeitDetails', forfeitDefinition, forfeitDetailsForDb, function (validationRes) {
            if (validationRes.operationResult == 0) {
                forfeitRepo.add(forfeitDetailsForDb, function (data) {
                    done(data);
                });
            }
            else {
                done(validationRes);
            }
        });


    });


};
