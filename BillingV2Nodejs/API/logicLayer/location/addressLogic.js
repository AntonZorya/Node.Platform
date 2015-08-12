var repo = require('../../dataLayer/repositories/location/addressRepo');

exports.getById = function (id, done) {
    repo.getById(id, function (data) {
        done(data);
    })
};

exports.getAll = function (done) {
    repo.getAll(function (data) {
        done(data);
    });
};
