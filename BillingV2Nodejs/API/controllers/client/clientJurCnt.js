var Logic = require('../../logicLayer/client/clientJurLogic'),
    PaymentLogic = require('../../logicLayer/payment/paymentLogic');


module.exports = function (router) {
    router.route('/clientJur/add').
        post(function (req, res) {
            Logic.add(req.body, req.user.organizationId, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/clientsJur').
        get(function (req, res) {
            Logic.getAll(req.user.organizationId, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/clientsByCtrl').
        get(function (req, res) {
            Logic.getAllByControllerId(req.query.controllerId, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/syncClients').
        post(function (req, res) {
            Logic.sync(req.body.clients, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/clientJur').
        get(function (req, res) {
            Logic.get(req.query.id, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route("/clientJur/update")
        .post(function (req, res) {
            Logic.update(req.body, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route("/clientJur")
        .delete(function (req, res) {
            Logic.delete(req.query.id, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route("/clientJur/search")
        .get(function (req, res) {
            Logic.search(req.query.searchTerm, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/clientJur/updateClientCounter')
        .post(function (req, res) {
            Logic.updateClientCounter(req.body, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/clientJur/paymentAdd')
        .post(function (req, res) {
            PaymentLogic.add(req.body, function (data) {
                operationResultBuilder(data, res);
            });
        });

};
