var ReportRepo = require(_repositoriesPath+'report/reportRepo');

exports.get = function (done) {
    ReportRepo.get(function (res) {
        return done(res);
    });
}