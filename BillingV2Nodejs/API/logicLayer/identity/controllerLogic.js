var ControllerRepo = require('../../dataLayer/repositories/identity/controllerRepo');


exports.getAll = function(done){

	ControllerRepo.getAll(function(data){
		if(data.operationResult==0){
			return done(data);
		}
		else return done({operationResult:1, error:data.error});
	});
}