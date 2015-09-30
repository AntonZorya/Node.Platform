var paymentDef = require('../../models/paymentDetails/paymentDetailsFiz');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('paymentDetailsFiz', paymentDef);

exports.add = function (payment, done) {
    var model = Collection(payment);
    model.save(function (err) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0});
    });
};

exports.getByClientId = function (clientId, done) {
    Collection.find({clientId: clientId}, function (err, payments) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0, result: payments});
    });
};

exports.getByPeriod = function (dateFrom, dateTo, done) {
    Collection.find({date: {$gte: dateFrom, $lte: dateTo}}).populate('clientId').exec(function (err, res) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0, result: res});
    });
};


exports.getByPeriodAndClientId = function (period, clientId, done) {
    Collection.find(
        {
            $and: [
                //{date: {$gte: dateFrom, $lte: dateTo}},
                {period: period},
                {clientId: clientId}
            ]
        }
    ).populate('clientId').populate('balanceId').exec(function (err, res) {
            if (err)return done(errorBuilder(err));
            done({operationResult: 0, result: res});
        });
};