/**
 * Created by Alibek on 01.10.2015.
 */
var periodRepo = require('../../dataLayer/repositories/period/periodRepo');


exports.getAll = function(done)
{
    periodRepo.getAll(function(data) {
       return done(data);
    });
}

exports.getByYear = function(year, done)
{
    periodRepo.getAllByYear(year, function(data) {
        return done(data);
    });
}


exports.add = function(period, done)
{
    periodRepo.add(period, function(data) {
       return done(data);
    });
}

exports.update = function(period, done) {
    periodRepo.update(period, function(data) {
       return done(data);
    });
}


exports.close = function(period, done) {
    periodRepo.get(period, function(data) {
        if (data.operationResult != 0)
            return done(data);
        if (!data.result)
            return done({operationResult: 1, result: "#periodNotFound"});
        var period = data.result;
        period.isClose = true;

    })
}