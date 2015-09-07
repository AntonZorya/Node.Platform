var definition = require('../../models/tariff/tariff');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('tariff', definition);

exports.getAll = function (done) {
    Collection.find({isDeleted: false}, null, {sort: {name: 1}}, function (err, res) { //,
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: res});
    });
};


exports.getById = function (id, done) {
    Collection.findOne({_id: id}, function (err, res) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: res});
    });
};
