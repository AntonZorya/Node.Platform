var calcDef = require('../../models/calculations/calculation');
var calcCollection = new require('../../../helpers/mongoose/modelBuilder')('Calculation', calcDef);

exports.add = function (calculation, done) {
    var model = calcCollection(calculation);
    model.save(function (err, res) {
        if (err)return done(errorBuilder(err, res));
        done({operationResult: 0, result: res});
    });
};