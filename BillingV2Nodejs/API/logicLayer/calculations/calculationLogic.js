var CalcRepo = require('../../dataLayer/repositories/calculations/calculationRepo'),
    validator = require(_helpersMongoosePath + 'validator'),
    calcDefinition = require(_modelsPath + 'calculations/calculation'),
    mongoose = require('mongoose');


exports.add = function (calculation, done) {

    validator('calculation', calcDefinition, calculation, function (validationRes) {
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

        validator('calculation', calcDefinition, calculation, function (validationRes) {
            if (validationRes.operationResult == 0) {
                CalcRepo.add(calculation, function (data) {
                    if (calculations.length - 1 === index)
                        done(data);
                });
            }
            else
                done(validationRes);
        });
    });
};

exports.update = function (calculation, done) {
    validator('calculation', calcDefinition, calculation, function (validationRes) {
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

