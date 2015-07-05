var AccruelRepo = require('../../dataLayer/repositories/finance/accruelRepo');
var OrganizationRepo = require('../../dataLayer/repositories/identity/organizationRepo');


exports.add = function(accruel, done){

	OrganizationRepo.getById(accruel.organization._id, function(data){
		if(data.operationResult==0){
			accruel.organization = data.result._doc;
			AccruelRepo.add(accruel, function(data){
				return done(data);
			});
		}
		else return done({operationResult:1, error:data.error});
	});
}
