var Logic = require('../../logicLayer/client/clientJurLogic');

module.exports = function(router){
	router.route('/clientJur/add').
	post(function(req, res) {
		Logic.add(req.body, function(data){
			res.json(data);			
		});
	});
};