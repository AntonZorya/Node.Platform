var paymentDef = require('../../models/payment/payment');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('payment', paymentDef);

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
    Collection.find({date: {$gte: dateFrom, $lte: dateTo}}).populate('clientId').exec( function (err, res) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0, result: res});
    });
};