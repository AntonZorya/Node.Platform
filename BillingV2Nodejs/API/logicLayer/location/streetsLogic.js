var streetsRepo = require('../../dataLayer/repositories/location/streetRepo');

exports.getAll = function (done) {
    streetsRepo.getAll(function (data) {
        done(data);
    });
};
