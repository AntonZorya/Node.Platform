var balanceDef = require('../../models/balances/balance');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('Balance', balanceDef);

exports.add = function (balance, done) {
    var model = Collection(balance);
    model.save(function (err, res) {
        if (err)return done(errorBuilder(err, res));
        done({operationResult: 0, result:res});
    });
};

exports.getById = function (id, done) {
    Collection.find({_id: id}, function (err, res) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0, result: res});
    });
};

exports.getByPeriodAndByClientJurId = function (dateFrom, dateTo, clientJurId, done) {
    Collection.find(
        {
            $and: [
                {date: {$gte: dateFrom, $lte: dateTo}},
                {clientJurId: clientJurId}
            ]
        }
    ).populate('clientJurId').populate('counterId').exec(function (err, res) {
            if (err)return done(errorBuilder(err));
            done({operationResult: 0, result: res});
        });
};

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