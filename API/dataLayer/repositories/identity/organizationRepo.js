var Q = require('q');
var OrganizationDef = require('../../models/identity/organization');
var Collection =new require('../../../helpers/mongoose/modelBuilder')('Organization', OrganizationDef);
var ObjectId     = require('mongoose').Types.ObjectId;

exports.add = function(organization){		
	var deferred = Q.defer();
	
	Collection(organization).save(function(err) {
		if (err){
			deferred.reject({operationResult:1, error:err});
			return;
		}
		deferred.resolve({operationResult:0});
	});

	return deferred.promise;
};

exports.getByName = function(name){
	var deferred = Q.defer();

	Collection.findOne({organizationName: name}, function(err, organization) {
		if (err){
			deferred.reject({operationResult:1, result:null, error:err});
			return;
		}
		deferred.resolve({operationResult:0, result: organization});
	});

	return deferred.promise;
}

exports.getById = function(id){
	var deferred = Q.defer();

	Collection.findById(ObjectId(id), function(err, organization) {
		if (err){
			deferred.reject({operationResult:1, result:null, error:err});
			return;
		}
		deferred.resolve({operationResult:0, result: organization});
	});

	return deferred.promise;
}

exports.getAll = function(){
	var deferred = Q.defer();

	Collection.find(function(err, organizations) {
		if (err){
			deferred.reject({operationResult:1, error:err});
			return;
		}
		deferred.resolve({operationResult:0, result: organizations});
	});

	return deferred.promise;
};
