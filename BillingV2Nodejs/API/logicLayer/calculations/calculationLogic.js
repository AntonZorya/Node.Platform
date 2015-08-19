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