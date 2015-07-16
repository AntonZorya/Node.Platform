var ClientJurRepo = require(_repositoriesPath+'client/clientJurRepo');
var ControllerRepo = require('../../dataLayer/repositories/identity/controllerRepo');
var async = require('async');

exports.get = function (period, done) {
    ClientJurRepo.report(period, function (data) {
        if (data.operationResult == 0 && data.result != null) {
            var resultList = [];
            ControllerRepo.getAll(function(data2){
                if (data2.operationResult == 0 && data2.result != null) {
                    async.each(data2.result, function(item2, callback2){
                        
                        
                        async.each(data.result, function(item, callback){
                            if(item2._id.equals(item._id.controllerId))
                                resultList.push({controllerId:item2.fullName, date:item._id.yearMonthDay, total:item.total});
                            callback();
                        }, function(err){
                            if(err){
                                callback2(err);
                            }
                            else{
                                callback2();
                            }
                        });
                        
                        
                    }, function(err){
                        if(err) done({ operationResult: 1, result: err });
                        else return done(resultList);
                    });
                }
                else{
                    return done(data2);
                }
                
            });
            
            
        }
        else {
			return done(data);
		}
    });
}



exports.getCounts = function (period, done) {
    ClientJurRepo.reportCounts(period, function (data) {
        if (data.operationResult == 0 && data.result != null) {
            var resultList = [];
            ControllerRepo.getAll(function(data2){
                if (data2.operationResult == 0 && data2.result != null) {
                    async.each(data2.result, function(item2, callback2){


                        async.each(data.result, function(item, callback){
                            if(item2._id.equals(item._id.controllerId))
                                resultList.push({controllerId:item2.fullName, date:item._id.yearMonthDay, total:item.total});
                            callback();
                        }, function(err){
                            if(err){
                                callback2(err);
                            }
                            else{
                                callback2();
                            }
                        });


                    }, function(err){
                        if(err) done({ operationResult: 1, result: err });
                        else return done(resultList);
                    });
                }
                else{
                    return done(data2);
                }

            });


        }
        else {
            return done(data);
        }
    });
}