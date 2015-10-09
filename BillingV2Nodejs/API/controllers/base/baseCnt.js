var mongoose = require('mongoose');

module.exports = function (router) {
    router.route('/base/getNewObjectId').
        get(function (req, res) {
            var result;
            if (req.count) {
                result = [];
                for (var i = 0; i < req.count; i++) {
                    result.push(new mongoose.Types.ObjectId().toString());
                }
            } else {
                result = new mongoose.Types.ObjectId().toString();
            }
            operationResultBuilder({operationResult: 0, result: result}, res);
        });
};