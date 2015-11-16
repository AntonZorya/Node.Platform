var forfeitDetailsDef = require('../../models/forfeitDetails/forfeitDetails'),
    forfeitCollection = new require('../../../helpers/mongoose/modelBuilder')('forfeitDetails', forfeitDetailsDef);

exports.add = function (forfeitDetails, done) {
    var model = forfeitCollection(forfeitDetails);
    model.save(function (err) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0});
    });
};



exports.update = function (forfeitDetails, done) {
    if (forfeitDetails._id) {
        forfeitCollection.findOneAndUpdate({_id: forfeitDetails._id}, forfeitDetails, {new: true}, function (err, res) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0, result: res});
        });
    }
    else {
        return done({operationResult: 1, result: "#forfeitDetailsNotFound"});
    }
};

exports.delete = function (forfeitDetails, done) {
    if (forfeitDetails._id) {
        forfeitCollection.findOneAndUpdate({_id: forfeitDetails._id}, {isDeleted: true}, function (err) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0});
        });
    }
};

exports.getByPeriodAndClientId = function (period, clientId, done) {
    forfeitCollection.find(
        {
            $and: [
                //{date: {$gte: dateFrom, $lte: dateTo}},
                {period: period},
                {clientJurId: clientId},
                {isDeleted: false}
            ]
        }
    ).populate('clientJurId').populate('balanceId').exec(function (err, res) {
            if (err)return done(errorBuilder(err));
            done({operationResult: 0, result: res});
        });
};