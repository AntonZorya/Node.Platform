var forfeitDetailsDef = require('../../models/forfeitDetails/forfeitDetailsFiz'),
    forfeitCollection = new require('../../../helpers/mongoose/modelBuilder')('forfeitDetailsFiz', forfeitDetailsDef);

exports.add = function (forfeitDetails, done) {
    var model = forfeitCollection(forfeitDetails);
    model.save(function (err) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0});
    });
};

exports.getByPeriodAndClientId = function (period, clientId, done) {
    forfeitCollection.find(
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