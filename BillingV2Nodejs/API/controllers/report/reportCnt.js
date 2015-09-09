var ReportLogic = require(_logicPath + 'report/reportLogic');

module.exports = function (router) {
    router.route("/report1")
    .get(function (req, res) {
        ReportLogic.report1(req.query.period, function (data) {
            operationResultBuilder(data, res);
        });
    });


    router.route("/report2")
        .get(function (req, res) {
            ReportLogic.report2(req.query.period, function (data) {
                operationResultBuilder(data, res);
            });
        });
}