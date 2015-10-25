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
    ).populate('clientId').populate('balanceTypeId').exec(function (err, res) {
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

var balanceTypes = [
    {
        name: 'forfeit',
        id: '55cdf5c5bd2c5768423c5796'
    }, {
        name: 'payment',
        id: '55cdf61a2a5acf103fc2b6ed'
    }, {
        name: 'nachisl',
        id: '55cdf641fb777624231ab6d9'
    }
];
exports.getGroupedSumBalance = function (period, done) {
    Collection.aggregate(
        {
            $match: {
                period: period,
                isDeleted: false
            }
        }, {
            $group: {
                _id: '$balanceTypeId',
                sum: {
                    $sum: '$sum'
                }
            }
        }, function (err, result) {
            if (err) return done(errorBuilder(err[0]));
            var res = {};
            result.forEach(function(group){
                var name = _.find(balanceTypes, function(type){
                    return type.id == group._id;
                }).name;
                res[name] = group.sum;
            });
            done({operationResult: 0, result: res});
        }
    );
}

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

