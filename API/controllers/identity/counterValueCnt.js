var Logic = require('../../logicLayer/identity/counterValueLogic');

module.exports = function(router) {

	router.route('/identity/countervalue').
	post(function(req, res) {
		Logic.add(req.body, function(data) {

			res.json(data);

		})
	});
}