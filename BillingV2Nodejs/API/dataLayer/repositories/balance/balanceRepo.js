var balanceDef = require('../../models/balances/balance');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('Balance', balanceDef);
var CollectionSchema = new require('../../../helpers/mongoose/modelBuilder')('Balance', balanceDef, true);

var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
CollectionSchema.plugin(deepPopulate);

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

exports.add = function (balance, done) {
    var model = Collection(balance);
    model.save(function (err, res) {
        if (err)return done(errorBuilder(err, res));
        done({operationResult: 0, result: res});
    });
};

exports.removeByPipelineId = function (pipelineId, done) {
    Collection.findOneAndRemove({pipelineId: pipelineId}, function (err) {
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
        Collection.findOneAndUpdate({_id: balanceId}, {isDeleted: true}, function (err) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0});
        });
    }
};

exports.getById = function (id, done) {
    Collection.find({_id: id, isDeleted: false}, function (err, res) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0, result: res});
    });
};

exports.getByClientJurId = function (clientJurId, period, done) {
    Collection.find(
        {
            $and: [
                {clientJurId: clientJurId},
                {period: period},
                {isDeleted: false}
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
                {clientFizId: clientFizId},
                {isDeleted: false}
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
                {isDeleted: false},
                {date: {$gte: dateFrom, $lte: dateTo}}
            ]
        }
    ).deepPopulate('clientJurId balanceTypeId').exec(function (err, res) {
            if (err)return done(errorBuilder(err));
            done({operationResult: 0, result: res});
        });
};

exports.getAllBalance = function (period, done) {
    Collection.find({
        period: period,
        isDeleted: false
    }).deepPopulate('clientJurId balanceTypeId').exec(function (err, res) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0, result: res});
    });
};

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

//�� ������������
exports.getByPeriodAndByClientJurId = function (dateFrom, dateTo, clientJurId, done) {
    Collection.find(
        {
            $and: [
                {date: {$gte: dateFrom, $lte: dateTo}},
                {clientJurId: clientJurId},
                {isDeleted: false}
            ]
        }
    ).populate('clientJurId').exec(function (err, res) {
            if (err)return done(errorBuilder(err));
            done({operationResult: 0, result: res});
        });
};

//�� ������������
exports.getByPeriodAndByClientFizId = function (dateFrom, dateTo, clientFizId, done) {
    Collection.find(
        {
            $and: [
                {date: {$gte: dateFrom, $lte: dateTo}},
                {clientFizId: clientFizId},
                {isDeleted: false}
            ]
        }
    ).populate('clientFizId').populate('counterId').exec(function (err, res) {
            if (err)return done(errorBuilder(err));
            done({operationResult: 0, result: res});
        });
};


exports.getGroupedByType = function (period, done) {

}