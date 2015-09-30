var forfeitRepo = require('../../dataLayer/repositories/forfeitDetails/forfeitDetailsFizRepo');
var validator = require(_helpersMongoosePath + 'validator');
var forfeitDefinition = require(_modelsPath + 'forfeitDetails/forfeitDetailsFiz');
var balanceFizLogic = require('../../logicLayer/balance/balanceFizLogic');
var mongoose = require('mongoose');

exports.add = function (forfeitDetails, userId, done) {


    var balanceId = mongoose.Types.ObjectId();
    var balanceTypeId = '55cdf5c5bd2c5768423c5796';//штраф
    var period = forfeitDetails.period;

    var forfeitDetailsForDb = {
        balanceId: balanceId,
        comment: forfeitDetails.comment,
        files: forfeitDetails.files,
        clientId: forfeitDetails.clientId,

        period: period,
        //аудит
        date: new Date(),
        userId: userId

    };

    var balance = {
        _id: balanceId,
        balanceTypeId: balanceTypeId,
        clientId: forfeitDetails.clientId,
        sum: (forfeitDetails.sum) * (-1),

        period: period,
        //аудит
        date: new Date(),
        userId: userId
    };

    balanceFizLogic.add(balance, function (response) {

        validator('forfeitDetailsFiz', forfeitDefinition, forfeitDetailsForDb, function (validationRes) {
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

