var paymentDef = require('../../models/payment/payment');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('payment', paymentDef);

exports.add = function (payment, done) {
    var model = Collection(payment);
    model.save(function (err) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0});
    });
};