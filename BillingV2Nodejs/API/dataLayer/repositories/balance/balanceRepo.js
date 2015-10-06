var balanceDef = require('../../models/balances/balance');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('Balance', balanceDef);
var CollectionSchema = new require('../../../helpers/mongoose/modelBuilder')('Balance', balanceDef, true);

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

exports.removeByPipelineId = function (pipelineId, done) {
    Collection.findOneAndRemove({pipelineId: pipelineId}, function(err){
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0});
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

exports.remove = function (balanceId, done) {
    if (balanceId) {
        Collection.findOneAndRemove({_id: balanceId}, function (err) {
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

exports.getByClientJurId = function (clientJurId, period, done) {
    Collection.find(
        {
            $and: [
                {clientJurId: clientJurId},
                {period: period}
            ]
        }
    ).populate('clientJurId').populate('balanceTypeId').exec(function (err, res) {
            if (err)return done(errorBuilder(err));
            done({operationResult: 0, result: res});
        });
};

exports.getByClientFizId = function (clientFizId, done) {
    Collection.find(
        {
            $and: [
                {clientFizId: clientFizId}
            ]
        }
    ).populate('clientFizId').populate('balanceTypeId').exec(function (err, res) {
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
    ).deepPopulate('clientJurId balanceTypeId').exec(function (err, res) {
            if (err)return done(errorBuilder(err));
            done({operationResult: 0, result: res});
        });
};

exports.getAllBalance = function (period, done) {
    Collection.find({period: period}).deepPopulate('clientJurId balanceTypeId').exec(function (err, res) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0, result: res});
    });
};

//не используется
exports.getByPeriodAndByClientJurId = function (dateFrom, dateTo, clientJurId, done) {
    Collection.find(
        {
            $and: [
                {date: {$gte: dateFrom, $lte: dateTo}},
                {clientJurId: clientJurId}
            ]
        }
    ).populate('clientJurId').exec(function (err, res) {
            if (err)return done(errorBuilder(err));
            done({operationResult: 0, result: res});
        });
};

//не используется
exports.getByPeriodAndByClientFizId = function (dateFrom, dateTo, clientFizId, done) {
    Collection.find(
        {
            $and: [
                {date: {$gte: dateFrom, $lte: dateTo}},
                {clientFizId: clientFizId}
            ]
        }
    ).populate('clientFizId').populate('counterId').exec(function (err, res) {
            if (err)return done(errorBuilder(err));
            done({operationResult: 0, result: res});
        });
};


exports.getGroupedByType = function (period, done) {

}