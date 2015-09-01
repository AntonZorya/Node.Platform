var calcDef = require('../../models/calculations/calculation');
var calcCollection = new require('../../../helpers/mongoose/modelBuilder')('Calculation', calcDef);

exports.add = function (calculation, done) {
    var model = calcCollection(calculation);
    model.save(function (err, res) {
        if (err)return done(errorBuilder(err, res));
        done({operationResult: 0, result: res});
    });
};


exports.getByPeriodAndClientId = function (period, clientId, done) {
    calcCollection.find(
        {
            $and: [
                //{date: {$gte: dateFrom, $lte: dateTo}},
                {period: period},
                {clientJurId: clientId}
            ]
        }
    ).populate('clientJurId').populate('balanceId').exec(function (err, res) {
            if (err)return done(errorBuilder(err));
            done({operationResult: 0, result: res});
        });
};