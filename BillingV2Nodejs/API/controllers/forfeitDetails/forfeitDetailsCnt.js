var Logic = require('../../logicLayer/forfeitDetails/forfeitDetailsLogic');
var LogicFiz = require('../../logicLayer/forfeitDetails/forfeitDetailsFizLogic');

module.exports = function (router) {

    router.route('/forfeitDetails/add').
        post(function (req, res) {
            var forfeitDetails = req.body.forfeitDetails;
            var user = req.body.user;

            Logic.add(forfeitDetails, user._id, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/forfeitDetailsFiz/add').
        post(function (req, res) {
            var forfeitDetails = req.body.forfeitDetails;
            var user = req.body.user;

            LogicFiz.add(forfeitDetails, user._id, function (data) {
                operationResultBuilder(data, res);
            });
        });

};