var Logic = require('../../logicLayer/balance/balanceFizLogic');

module.exports = function (router) {

    router.route('/balanceFiz/getByPeriod').
        get(function (req, res) {
            Logic.getByPeriod(req.query.dateFrom, req.query.dateTo, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/balanceFiz/getAllBalance').
        get(function (req, res) {
            Logic.getAllBalance(req.query.period, function (data) {
                operationResultBuilder(data, res);
            });
        });


    router.route('/balanceFiz/getTotalByClientId').
        get(function (req, res) {
            Logic.getTotalByClientJurId(req.query.clientId, req.query.period, function (data) {
                operationResultBuilder(data, res);
            });
        });


    router.route('/balanceFiz/getByClientId').
        get(function (req, res) {
            Logic.getByClientJurId(req.query.clientId, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/balanceFiz/getByPeriodAndClientIdWithDetails').
        get(function (req, res) {
            Logic.getByPeriodAndClientIdWithDetails(req.query.clientId, req.query.period, function (data) {
                operationResultBuilder(data, res);
            });
        });


};