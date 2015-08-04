var repo = require('../../dataLayer/repositories/references/counterMarkRepo');

exports.getAll = function (done) {
    repo.getAll(function (data) {
        done(data);
    });
};
