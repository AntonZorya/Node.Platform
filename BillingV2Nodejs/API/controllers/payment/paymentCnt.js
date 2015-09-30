var PaymentLogic = require('../../logicLayer/payment/paymentLogic');
var PaymentFizLogic = require('../../logicLayer/payment/paymentFizLogic');

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

    router.route('/paymentfiz/paymentAdd')
        .post(function (req, res) {
            PaymentFizLogic.add(req.body, req.body.user._id, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route("/paymentsFizByClientId")
        .get(function (req, res) {
            PaymentFizLogic.getByClientId(req.query.clientId, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route("/paymentsFizByPeriod")
        .get(function (req, res) {
            PaymentFizLogic.getByPeriod(req.query.dateFrom, req.query.dateTo, function (data) {
                operationResultBuilder(data, res);
            });
        });

};