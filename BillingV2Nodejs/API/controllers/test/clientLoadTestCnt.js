/**
 * Created by vaio on 13.10.2015.
 */
var clientFactory = require("devir-mbclient");
var client = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function (isReconecting) {
});
module.exports = function (router) {

    router.route('/loadings/negotiableLoad/getAllOrGroup').
        get(function (req, res) {
            client.sendRequest("/loadings/negotiableLoad/getAllOrGroup", {groupNumber: req.query.groupNumber}, function (err, data) {
                res.json(data);
            });
        });

};