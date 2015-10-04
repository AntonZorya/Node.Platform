/**
 * Created by Alibek on 01.10.2015.
 */
var definition = require('../../models/period/period');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('period', definition);


exports.getAll = function(done) {
    Collection.find({isDeleted: false}, null, {sort: {period: 1}}, function (err, res) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: res});
    });
}


exports.getAllByYear = function(year, done) {
    Collection.find({year: year, isDeleted: false}, null, {sort: {period: 1}}, function (err, res) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: res});
    });
}

exports.get = function(period, done) {
    Collection.find({period: period, isDeleted: false}, null, {sort: {period: 1}}, function (err, res) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: res});
    });
}


exports.add = function(period, done) {
    var model = Collection(period);
    model.save(function(err, res) {
       if (err) return done(errorBuilder(err));
        return done({opertaionResult: 0, result: res});
    });
}

exports.update = function(period, done)
{
    if (period._id)
    {
        Collection.findOneAndUpdate({_id: period._id}, period, function(err, res) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0, result: res});
        });
    }
    else
    {
        return done({operationResult: 0, result: "#periodNotFound"});
    }
}

exports.remove =  function(periodId, done)
{
    if (periodId)
    {
        Collection.findOneAndRemove({_id: periodId}, function(err, res) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0, result: res});
        })
    }
}






