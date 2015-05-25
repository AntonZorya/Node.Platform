var Logic = require('../../logicLayer/finance/accruelLogic');

module.exports = function(router){
	router.route('/finance/accruel').
	post(function(req, res) {
		Logic.add(req.body).then(
			function(data)
			{
				res.json(data)
			},
			function(err){
				res.status(400);
				res.json(err);
			});
	});
}