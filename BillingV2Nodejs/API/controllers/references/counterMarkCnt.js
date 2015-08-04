var Logic = require('../../logicLayer/references/counterMarkLogic');

module.exports = function (router) {

    router.route('/counterMarks').
        get(function (req, res) {
            Logic.getAll(function (data) {
                operationResultBuilder(data, res);
            });
        });

};