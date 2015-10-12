var clientFactory = require("devir-mbclient");
var client = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function (isReconecting) {
});
module.exports = function (router) {

    router.route('/addressType/getChildList').
        get(function (req, res) {
            client.sendRequest("/addressType/getChildList", {id: req.query.id}, function (err, data) {
                res.json(data);
            });
        });

    router.route('/address/getChildList').
        get(function (req, res) {
            client.sendRequest("/address/getChildList", {
                parentId: req.query.parentId,
                typeId: req.query.typeId
            }, function (err, data) {
                res.json(data);
            });
        });

    router.route('/address/collectAllParents').
        get(function (req, res) {
            client.sendRequest("/address/collectAllParents", {id: req.query.id}, function (err, data) {
                res.json(data);
            });
        });
};