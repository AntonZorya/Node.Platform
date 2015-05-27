var Logic = require('../../logicLayer/finance/accruelLogic');

module.exports = function(router){
	Logic.add()
	router.route('/finance/accruel').
	post(function(req, res) {
		Logic.add(req.body, function(data){
		
			res.json(data);
			
			
		});
	});
};