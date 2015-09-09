var ReportLogic = require(_logicPath + 'report/reportLogic');

module.exports = function (router) {
    router.route("/report1")
    .get(function (req, res) {
        ReportLogic.get(req.query.period, function (data) {
            operationResultBuilder(data, res);
        });
    });


    router.route("/reportCounts")
        .get(function (req, res) {
            ReportLogic.getCounts(req.query.period, function (data) {
                operationResultBuilder(data, res);
            });
        });
}