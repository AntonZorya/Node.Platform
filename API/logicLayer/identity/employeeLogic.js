var EmployeeRepo = require('../../dataLayer/repositories/identity/employeeRepo');
var OrganizationRepo = require('../../dataLayer/repositories/identity/organizationRepo');
var async = require("async");
var Q = require('q');


exports.add = function(employee){
	var deferred = Q.defer();

	OrganizationRepo.getById(employee.organizationId).then(function(data){
		if(data.result!=null){

			EmployeeRepo.add(employee).then(function(addresult){
				deferred.resolve(addresult);
			}, function(err){
				deferred.reject(err);
			});
		} 
		else{
			deferred.reject({operationResult: 1, err: "Организация не найдена"});
		}
	});

	return deferred.promise;
}

exports.get = function(id){
	var deferred = Q.defer();

	EmployeeRepo.get(id).then(function(data){
		deferred.resolve(data);
	},function(err){
		deferred.reject({operationResult: 1, err: "Ощибка"});
	});

	return deferred.promise;
}





