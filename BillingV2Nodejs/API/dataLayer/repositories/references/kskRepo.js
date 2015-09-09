var definition = require('../../models/references/ksk');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('ksk', definition);

exports.getAll = function (done) {
    Collection.find({isDeleted: false}, null, {sort: {name: 1}}, function (err, res) { //,
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: res});
    });
};
