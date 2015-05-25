var AccruelRepo = require('../../dataLayer/repositories/finance/accruelRepo');
var OrganizationRepo = require('../../dataLayer/repositories/identity/organizationRepo');
var Q = require('q');


exports.add = function(accruel){
	var deferred = Q.defer();

	OrganizationRepo.getById(accruel.organization._id).then(function(data){
		if(data.result!=null){
			accruel.organization = data.result._doc;
			AccruelRepo.add(accruel).then(function(addresult){
				deferred.resolve(addresult);
			}, function(err){
				deferred.reject(err);
			});
		} else{
			deferred.reject({operationResult: 1, err: "Неверная организация"});
		}
	})

	return deferred.promise;


	
}
