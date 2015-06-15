var Logic = require('../../logicLayer/finance/accruelLogic');

module.exports = function(router){
	router.route('/finance/accruel').
	post(function(req, res) {
		Logic.add(req.body, function(data){
			res.json(data);			
		});
	});
};