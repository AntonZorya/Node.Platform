var PaymentLogic = require('../../logicLayer/payment/paymentLogic');

module.exports = function (router) {

    router.route('/payment/paymentAdd')
        .post(function (req, res) {
            PaymentLogic.add(req.body, req.body.user._id, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route("/paymentsByClientId")
        .get(function (req, res) {
            PaymentLogic.getByClientId(req.query.clientId, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route("/paymentsByPeriod")
        .get(function (req, res) {
            PaymentLogic.getByPeriod(req.query.dateFrom, req.query.dateTo, function (data) {
                operationResultBuilder(data, res);
            });
        });

};