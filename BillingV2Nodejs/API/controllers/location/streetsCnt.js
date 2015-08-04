var streetsLogic = require('../../logicLayer/location/streetsLogic');

module.exports = function (router) {

    router.route('/streets').
        get(function (req, res) {
            streetsLogic.getAll(function (data) {
                operationResultBuilder(data, res);
            });
        });

};