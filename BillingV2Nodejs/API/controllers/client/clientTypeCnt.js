var Logic = require('../../logicLayer/client/clientTypeLogic');

module.exports = function (router) {

    router.route('/clientTypes').
        get(function (req, res) {
            Logic.getAll(function (data) {
                operationResultBuilder(data, res);
            });
        });
};