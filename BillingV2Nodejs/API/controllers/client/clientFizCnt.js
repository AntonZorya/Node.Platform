var Logic = require('../../logicLayer/client/clientFizLogic');


module.exports = function (router) {
	router.route('/clientFiz/add').
		post(function (req, res) {
			Logic.add(req.body, req.user.organizationId, function (data) {
				operationResultBuilder(data, res);
			});
		});

	router.route('/clientsFiz').
		get(function (req, res) {
			Logic.getAll(req.user.organizationId, function (data) {
				operationResultBuilder(data, res);
			});
		});

	router.route('/clientsFizByCtrl').
		get(function (req, res) {
			Logic.getAllByControllerId(req.query.controllerId, function (data) {
				operationResultBuilder(data, res);
			});
		});

	router.route('/syncClientsFiz').
		post(function (req, res) {
			Logic.sync(req.body.clients, function (data) {
				operationResultBuilder(data, res);
			});
		});

	router.route('/clientFiz').
		get(function (req, res) {
			Logic.get(req.query.id, function (data) {
				operationResultBuilder(data, res);
			});
		});

	router.route("/clientFiz/update")
		.post(function (req, res) {
			Logic.update(req.body, function (data) {
				operationResultBuilder(data, res);
			});
		});

	router.route("/clientFiz")
		.delete(function (req, res) {
			Logic.delete(req.query.id, function (data) {
				operationResultBuilder(data, res);
			});
		});

	router.route("/clientFiz/search")
		.get(function (req, res) {
			Logic.search(req.query.searchTerm, function (data) {
				operationResultBuilder(data, res);
			});
		});

	router.route('/clientFiz/updateClientCounter')
		.post(function (req, res) {
			Logic.updateClientCounter(req.body, req.user._id, function (data) {
				operationResultBuilder(data, res);
			});
		});


};
