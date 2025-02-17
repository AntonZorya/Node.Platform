var Logic = require('../../logicLayer/tariff/tariffLogic');

module.exports = function (router) {

    router.route('/tariff/add').
        post(function (req, res) {
            Logic.add(req.body, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/tariffs').
        get(function (req, res) {
            Logic.getAll(function (data) {
                operationResultBuilder(data, res);
            });
        });
};