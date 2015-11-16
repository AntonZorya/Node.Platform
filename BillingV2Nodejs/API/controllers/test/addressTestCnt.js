var mbClientConn = require('../../helpers/mbConnection/mbConnection');
var mbClient = mbClientConn(function (isReconecting) {
});
module.exports = function (router) {

    router.route('/addressType/getChildList').
        get(function (req, res) {
            mbClient.sendRequest("/addressType/getChildList", {id: req.query.id}, function (err, data) {
                res.json(data);
            });
        });

    router.route('/address/getChildList').
        get(function (req, res) {
            mbClient.sendRequest("/address/getChildList", {
                parentId: req.query.parentId,
                typeId: req.query.typeId
            }, function (err, data) {
                res.json(data);
            });
        });

    router.route('/address/collectAllParents').
        get(function (req, res) {
            mbClient.sendRequest("/address/collectAllParents", {id: req.query.id}, function (err, data) {
                res.json(data);
            });
        });
};