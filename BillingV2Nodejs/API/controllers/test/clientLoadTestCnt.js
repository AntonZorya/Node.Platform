var mbClientConn = require('../../helpers/mbConnection/mbConnection');
var mbClient = mbClientConn(function (isReconecting) {
});
module.exports = function (router) {

    router.route('/loadings/negotiableLoad/getAllOrGroup').
        get(function (req, res) {
            mbClient.sendRequest("/loadings/negotiableLoad/getAllOrGroup", {groupNumber: req.query.groupNumber}, function (err, data) {
                res.json(data);
            });
        });

};