var Logic = require('../../logicLayer/identity/employeeLogic');

module.exports = function(router){
	router.route('/identity/employee').
	post(function(req, res) {
		Logic.add(req.body).then(
			function(data)
			{
				console.log("hi vasya!");
				res.json(data)
			},
			function(err){
				res.status(400);
				res.json(err);
			});
	});

	router.route('/identity/employee/:id').
	get(function(req, res){
		Logic.get(req.params.id).then(
			function(data){
				res.json(data)
			},
			function(){
				res.status(400);
				res.json(err);
			});
	});

	

}