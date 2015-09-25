var ControllerLogic = require(_logicPath+'identity/controllerLogic');

module.exports = function(router){
	router.route('/controllers').
	get(function(req,res){
		ControllerLogic.getAll(function(data){
			operationResultBuilder(data, res);
		})
	});

};

