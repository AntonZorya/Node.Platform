var OrganizationDef = require('../../models/identity/organization');
var Collection =new require('../../../helpers/mongoose/modelBuilder')('Organization', OrganizationDef);
var ObjectId     = require('mongoose').Types.ObjectId;

exports.add = function(organization, done){

	var model = Collection(organization);
	model.save(function(err) {
		if (err)return done({operationResult:1, error:err});
		done({operationResult:0});
	});
};

exports.getByName = function(name, done){

	Collection.findOne({organizationName: name}, function(err, organization) {
		if(err) return done({operationResult:1, error:err});
		done({operationResult:0, result: organization});
	});
}

exports.getById = function(id, done){

	Collection.findById(ObjectId(id), function(err, organization) {
		if(err) return done({operationResult:1, error:err});
		done({operationResult:0, result:organization});
	});
}

exports.getAll = function(done){

	Collection.find(function(err, organizations) {
		if(err) return done({operationResult: 1, error: err});
		done({operationResult:0, result: organizations});
	});
};
