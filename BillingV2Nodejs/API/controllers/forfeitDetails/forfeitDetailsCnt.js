var Logic = require('../../logicLayer/forfeitDetails/forfeitDetailsLogic');

module.exports = function (router) {

    router.route('/forfeitDetails/add').
        post(function (req, res) {
            var forfeitDetails = req.body.forfeitDetails;
            var user = req.body.user;

            Logic.add(forfeitDetails, user._id, function (data) {
                operationResultBuilder(data, res);
            });
        });

};