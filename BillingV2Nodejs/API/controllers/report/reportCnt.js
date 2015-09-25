var ReportLogic = require(_logicPath + 'report/reportLogic');
var ClientJurRepo = require('../../dataLayer/repositories/client/clientJurRepo');

module.exports = function (router) {
    router.route("/report1")
    .get(function (req, res) {
        ReportLogic.report1(req.query.period, function (data) {
            operationResultBuilder(data, res);
        });
    });
    
    router.route("/report5")
    .get(function (req, res) {
        ClientJurRepo.report5(req.query.period, function (data) {
            operationResultBuilder(data, res);
        });
    });
    
    router.route("/report6")
    .get(function (req, res) {
        ClientJurRepo.report6(req.query.period, function (data) {
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