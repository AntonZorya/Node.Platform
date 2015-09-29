var balanceDef = require('../../models/balances/balanceFiz');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('BalanceFiz', balanceDef);
var CollectionSchema = new require('../../../helpers/mongoose/modelBuilder')('BalanceFiz', balanceDef, true);

var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
CollectionSchema.plugin(deepPopulate);


exports.add = function (balance, done) {
    var model = Collection(balance);
    model.save(function (err, res) {
        if (err)return done(errorBuilder(err, res));
        done({operationResult: 0, result: res});
    });
};

exports.update = function (balance, done) {
    if (balance._id) {
        Collection.findOneAndUpdate({_id: balance._id}, balance, function (err, res) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0, result: res});
        });
    }
    else {
        return done({operationResult: 1, result: "#balanceNotFound"});
    }
};

exports.remove = function(balanceId, done){
    if (balanceId){
        Collection.findOneAndRemove({_id: balanceId}, function(err){
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0});
        });
    }
}

exports.getById = function (id, done) {
    Collection.find({_id: id}, function (err, res) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0, result: res});
    });
};

exports.getByClientId = function (clientId, period, done) {
    Collection.find(
        {
            $and: [
                {clientId: clientId},
                {period: period}
            ]
        }
    ).populate('clientJurId').populate('balanceTypeId').exec(function (err, res) {
            if (err)return done(errorBuilder(err));
            done({operationResult: 0, result: res});
        });
};

exports.getByPeriod = function (dateFrom, dateTo, done) {
    Collection.find(
        {
            $and: [
                {date: {$gte: dateFrom, $lte: dateTo}}
            ]
        }
    ).deepPopulate('clientId balanceTypeId').exec(function (err, res) {
            if (err)return done(errorBuilder(err));
            done({operationResult: 0, result: res});
        });
};

exports.getAllBalance = function (period, done) {
    Collection.find({period: period}).deepPopulate('clientId balanceTypeId').exec(function (err, res) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0, result: res});
    });
};

//не используется
exports.getByPeriodAndByClientId = function (dateFrom, dateTo, clientId, done) {
    Collection.find(
        {
            $and: [
                {date: {$gte: dateFrom, $lte: dateTo}},
                {clientId: clientId}
            ]
        }
    ).populate('clientId').exec(function (err, res) {
            if (err)return done(errorBuilder(err));
            done({operationResult: 0, result: res});
        });
};

