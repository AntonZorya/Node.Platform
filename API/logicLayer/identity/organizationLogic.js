var OrganizationRepo = require('../../dataLayer/repositories/identity/organizationRepo');
var async = require("async");
var Q = require('q');


exports.add = function(organization){
	var deferred = Q.defer();

	OrganizationRepo.getByName(organization.organizationName).then(function(data){
		if(data.result==null){
			OrganizationRepo.add(organization).then(function(addresult){
				deferred.resolve(addresult);
			}, function(err){
				deferred.reject(err);
			});
		} else{
			deferred.reject({operationResult:1, err: 'Организация с таким наименованием уже существует'});
		}
	})

	return deferred.promise;
}

exports.getAll = function(){
	var deferred = Q.defer();

	OrganizationRepo.getAll().then(function(data){
		async.each(data.result, function(elem, callback){
			elem._doc.age="Алеша";
			callback();
		}, function(err){
			deferred.resolve(data);
		});
	});

	return deferred.promise;
}





