var calcDef = require('../../models/calculations/calculationFiz');
var calcCollection = new require('../../../helpers/mongoose/modelBuilder')('CalculationFiz', calcDef);

exports.add = function (calculation, done) {
    var model = calcCollection(calculation);
    model.save(function (err, res) {
        if (err)return done(errorBuilder(err, res));
        done({operationResult: 0, result: res});
    });
};

exports.update = function (calculation, done) {
    if (calculation._id) {
        calcCollection.findOneAndUpdate({_id: calculation._id}, calculation, function (err, res) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0, result: res});
        });
    }
    else {
        return done({operationResult: 1, result: "#calculationNotFound"});
    }
};

exports.remove = function(calculationId, done){
    if (calculationId){
        calcCollection.findOneAndRemove({_id: calculationId}, function(err){
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0});
        });
    }
}

exports.getByPeriodAndClientId = function (period, clientId, done) {
    calcCollection.find(
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


exports.getByCounterId = function (counterId, period, done) {
    calcCollection.findOne({
        $and: [
            {period: period},
            {counterId: counterId}
        ]
    }, function (err, res) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0, result: res});
    });
};