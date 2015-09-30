var Logic = require('../../logicLayer/client/clientTypeLogic');
var LogicFiz = require('../../logicLayer/client/clientTypeFizLogic');

module.exports = function (router) {

    router.route('/clientTypes').
        get(function (req, res) {
            Logic.getAll(function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/clientTypesFiz').
        get(function (req, res) {
            LogicFiz.getAll(function (data) {
                operationResultBuilder(data, res);
            });
        });
};