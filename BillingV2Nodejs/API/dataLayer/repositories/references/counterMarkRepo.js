var counterMarkDef = require('../../models/client/counterMark');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('CounterMark', counterMarkDef);

exports.getAll = function (done) {
    Collection.find({isDeleted: false}, null, {sort: {name: 1}}, function (err, res) { //,
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: res});
    });
};
