var balanceTypeDef = require('../../models/balances/balanceType');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('BalanceType', balanceTypeDef);

exports.getById = function (id, done) {
    Collection.find({_id: id}, function (err, res) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0, result: res});
    });
};


exports.add = function (balanceType, done) {
    var model = Collection(balanceType);
    model.save(function (err, res) {
        if (err)return done(errorBuilder(err, res));
        done({operationResult: 0, result:res});
    });
};
