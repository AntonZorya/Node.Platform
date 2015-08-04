var repo = require('../../dataLayer/repositories/references/kskRepo');

exports.getAll = function (done) {
    repo.getAll(function (data) {
        done(data);
    });
};
