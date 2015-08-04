var Logic = require('../../logicLayer/references/kskLogic');

module.exports = function (router) {

    router.route('/ksks').
        get(function (req, res) {
            Logic.getAll(function (data) {
                operationResultBuilder(data, res);
            });
        });

};