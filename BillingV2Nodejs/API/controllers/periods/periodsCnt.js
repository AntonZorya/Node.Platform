/**
 * Created by Alibek on 16.10.2015.
 */
var mbClientConn = require('../../helpers/mbConnection/mbConnection');
var mbClient = mbClientConn(function (isReconecting) {
});

module.exports = function (router) {
    router.route('/jur/periods/getCurrent')
        .get(function (req, res) {
            mbClient.sendRequest('/jur/periods/getCurrent', {}, function (err, data) {
                if (err) return operationResultBuilder(errorBuilder(err), res);
                return operationResultBuilder(data, res);
            });
        });

    router.route('/jur/periods/getClosed')
        .get(function (req, res) {
            mbClient.sendRequest('/jur/periods/getClosed', {}, function (err, data) {
                if (err) return operationResultBuilder(errorBuilder(err), res);
                return operationResultBuilder(data, res);
            });
        });
};