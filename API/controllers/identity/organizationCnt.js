var Logic = require('../../logicLayer/identity/organizationLogic');

module.exports = function(router){
	router.route('/identity/organization').
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

	router.route('/identity/organizations').
	get(function(req, res){
		Logic.getAll(req.body).then(
			function(data)
			{
				res.json(data)
			},
			function(err){
				res.status(500);
				res.json(err);
			});
	});
	

}