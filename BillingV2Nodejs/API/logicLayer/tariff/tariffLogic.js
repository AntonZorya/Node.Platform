var repo = require('../../dataLayer/repositories/tariff/tariffRepo');

exports.getAll = function (done) {
    repo.getAll(function (data) {
        done(data);
    });
};

exports.getById = function (id, done) {
    repo.getById(id, function (data) {
        done(data);
    });
};
