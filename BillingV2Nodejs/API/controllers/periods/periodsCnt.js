/**
 * Created by Alibek on 16.10.2015.
 */
var clientFactory = require("devir-mbclient");
var client = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function (isReconecting) {
});

module.exports = function (router) {
    router.route('/jur/periods/getCurrent')
        .get(function (req, res) {
            client.sendRequest('/period/getCurrentPeriod', {}, function (err, data) {
                if (err) return operationResultBuilder(errorBuilder(err), res);
                return operationResultBuilder(data, res);
            });
        });
}