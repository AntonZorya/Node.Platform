var UserLogic = require(_logicPath+'identity/userLogic');

module.exports = function(router){
	router.route('/identity/login').
	post(function(req,res){
		UserLogic.check(req.body, function(data){
			operationResultBuilder(data, res);
		})
	});

	router.route('/identity/loginController').post(
		function(req,res){
		UserLogic.checkController(req.body, function(data){
			operationResultBuilder(data, res);
		})
	});

	router.route('/identity/hui').delete(function(req, res){
		res.json({result:"1"});
    })

    router.route('/identity/register').post(function (req, res) {
        UserLogic.register(req.body, function (data) {
            operationResultBuilder(data, res);
        });
    });
}






