var Logic = require('../../logicLayer/client/clientFizLogic');

module.exports = function(router){
	router.route('/clientFiz/add').
	post(function(req, res) {
		Logic.add(req.body, function(data){
			operationResultBuilder(data, res);
		});
	});
	
	router.route('/clientsFiz').
	get(function(req, res) {
		Logic.getAll(function(data){
			operationResultBuilder(data, res);
		});
	});
};
