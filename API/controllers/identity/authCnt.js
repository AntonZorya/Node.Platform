var UserLogic = require('../../logicLayer/identity/userLogic');

module.exports = function(router){
	router.route('/identity/login').
	post(function(req,res){
		UserLogic.check(req.body.userName, req.body.password, req.body.rememberMe, function(data){
			
			res.json(data);
			
		})
	});
}





