var forfeitRepo = require('../../dataLayer/repositories/forfeitDetails/forfeitDetailsRepo');
var validator = require(_helpersMongoosePath + 'validator');
var forfeitDefinition = require(_modelsPath + 'forfeitDetails/forfeitDetails');
var balanceLogic = require('../../logicLayer/balance/balanceLogic');
var mongoose = require('mongoose');

exports.add = function (forfeitDetails, done) {


    var balanceId = mongoose.Types.ObjectId();
    var balanceTypeId = '55cdf5c5bd2c5768423c5796';//штраф

    var forfeitDetailsForDb = {
        balanceId: balanceId,
        comment: forfeitDetails.comment,
        files: forfeitDetails.files,
        clientJurId: forfeitDetails.clientId,
        //аудит
        date: new Date(),
        userId: "557f15402af16cc42c2cc351" //TODO: вытаскивать текущего юзера

    };

    var balance = {
        _id: balanceId,
        balanceTypeId: balanceTypeId,
        clientJurId: forfeitDetails.clientId,
        date: forfeitDetails.date,
        sum: (forfeitDetails.sum) * (-1)
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
