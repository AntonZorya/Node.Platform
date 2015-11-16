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

exports.update=function(forfeitDetails, userId, done) {
    //var forfeitID=$scope.forfeitDetailsId;

    var balanceId = forfeitDetails.balanceId;
    var balanceTypeId = '55cdf5c5bd2c5768423c5796';//штраф
    var period = forfeitDetails.period;

    balanceLogic.getById(balanceId,function(data){
        if(data.operationResult==0) {
            //console.log("data="+data._id);
            //console.log("BalanceId= "+balanceId);
            //console.log("IDDD="+forfeitDetails._id);
            //var forfeitDetailsForDB=forfeitDetails;
            //console.log("ForfDet= "+forfeitDetails.sum);
            var forfeitDetailsForDb = {
                _id: forfeitDetails._id,
                balanceId: balanceId,
                comment: forfeitDetails.comment,
                files: forfeitDetails.files,
                clientJurId: forfeitDetails.clientId,

                period: period,
                //аудит
                date: new Date(),
                userId: userId

            };


            //console.log("Id from BalanceID= "+data.result.O._doc._id);
            //console.log("ForfeitDet="+data.forfeitDetails);
            //console.log(data.result._id)

            var balance=data.result;
            balance.sum=forfeitDetails.sum;
                balance = {
                _id: balanceId,
                balanceTypeId: balanceTypeId,
                clientJurId: forfeitDetails.clientId,
                sum: (forfeitDetails.sum),

                period: period,
                //аудит
                date: new Date(),
                userId: userId
            };

            validator('forfeitDetails', forfeitDefinition, forfeitDetailsForDb, function (validationRes) {
                if (validationRes.operationResult == 0) {

                    balanceLogic.update(balance, function (response) {
                        if(response.operationResult==0){
                            forfeitRepo.update(forfeitDetailsForDb, function (data) {
                                done(data);

                            });
                        }else {
                            console.log("Err")
                        }
                    })

                }
                else {
                    done(validationRes);
                    console.log("Errror");
                }
            });

        }

        else{
            console.log("Err")
        }

    });
};

exports.delete = function (forfeitDetails, done) {
    var balanceIdI = forfeitDetails.balanceId._id;

    balanceLogic.getById(balanceIdI, function (data) {
        if (data.operationResult == 0) {

            var balanceId = forfeitDetails.balanceId;
            balanceLogic.remove(balanceId, function (response) {
                if (response.operationResult == 0) {
                    forfeitRepo.delete(forfeitDetails, function (data) {
                        done(data);
                    });
                }
                else {
                    console.log("Error")
                }
            })
        } else {
            done(validationRes);
            console.log("Errror");
        }
    })
}



