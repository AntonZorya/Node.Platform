var Logic = require('../../logicLayer/identity/employeeLogic');

module.exports = function(router){
	router.route('/identity/employee').
	post(function(req, res) {
		Logic.add(req.body, function(data){
			
			res.json(data);
			
		})
	});

	router.route('/identity/employee/:id').
	get(function(req, res){
		Logic.get(req.params.id, function(data){
			
			res.json(data);
			
		})
	});

	

}