var UserLogic = require(_logicPath+'identity/userLogic');

module.exports = function(router){
	router.route('/identity/login').
	post(function(req,res){
		UserLogic.check(req.body, function(data){
			
			res.json(data);
			
		});
	});
};





