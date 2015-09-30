var repo = require('../../dataLayer/repositories/client/clientTypeFizRepo');

exports.getAll = function (done) {
    repo.getAll(function (data) {
        done(data);
    });
};