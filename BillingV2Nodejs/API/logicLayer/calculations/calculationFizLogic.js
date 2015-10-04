var CalcRepo = require('../../dataLayer/repositories/calculations/calculationFizRepo'),
    validator = require(_helpersMongoosePath + 'validator'),
    calcDefinition = require(_modelsPath + 'calculations/calculationFiz'),
    mongoose = require('mongoose');


exports.add = function (calculation, done) {

    validator('calculationFiz', calcDefinition, calculation, function (validationRes) {
        if (validationRes.operationResult == 0)
            CalcRepo.add(calculation, function (data) {
                done(data);
            });
        else
            done(validationRes);
    });
};


exports.addMany = function (calculations, done) {

    _.each(calculations, function (calculation, index) {

        if (calculation != null)
            validator('calculation', calcDefinition, calculation, function (validationRes) {
                if (validationRes.operationResult == 0) {
                    CalcRepo.add(calculation, function (data) {
                        if (calculations.length - 1 === index)
                            return done(data);
                    });
                }
                else {
                    if (calculations.length - 1 === index)
                        done(validationRes);
                }

            });
    });
};

exports.update = function (calculation, done) {
    validator('calculationFiz', calcDefinition, calculation, function (validationRes) {
        if (validationRes.operationResult == 0) {
            CalcRepo.update(calculation, function (res) {
                return done(res);
            });
        }
        else {
            done(validationRes);
        }
    });
};

exports.getByCounterId = function (counterId, period, done) {
    CalcRepo.getByCounterId(counterId, period, function (data) {
        return done(data);
    });
};

exports.getByClientId = function(clientId, period, done) {
    CalcRepo.getByClientId(clientId, period, function(data) {
       return done(data);
    });
}

exports.hasByCounterByClientId = function(clientId, period, done) {
    CalcRepo.hasByCounter(clientId, period, function(data) {
       return done(data);
    });
}

exports.getByClientIdWithCounters = function(clientId, period, done) {
    CalcRepo.getByClientIdWithCounters(clientId, period, function(data) {
       return done(data);
    });
}


exports.remove = function(calculationId, done){
    CalcRepo.remove(calculationId, done);
};

