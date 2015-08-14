var forfeitDetailsDef = require('../../models/forfeitDetails/forfeitDetails'),
    forfeitCollection = new require('../../../helpers/mongoose/modelBuilder')('forfeitDetails', forfeitDetailsDef);

exports.add = function (forfeitDetails, done) {
    var model = forfeitCollection(forfeitDetails);
    model.save(function (err) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0});
    });
};