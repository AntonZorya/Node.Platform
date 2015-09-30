var Logic = require('../../logicLayer/tariff/tariffLogic');
var LogicFiz = require('../../logicLayer/tariff/tariffFizLogic');

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

    router.route('/tarifffiz/add').
        post(function (req, res) {
            LogicFiz.add(req.body, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/tariffsFiz').
        get(function (req, res) {
            LogicFiz.getAll(function (data) {
                operationResultBuilder(data, res);
            });
        });
};