var OrganizationDef = require('../../models/identity/organization');
var Collection =new require('../../../helpers/mongoose/modelBuilder')('Organization', OrganizationDef);
var ObjectId     = require('mongoose').Types.ObjectId;

exports.add = function(organization, done){

	Collection.create(organization, function(err, res) {
		if (err)return done(errorBuilder(err));
		return done({ operationResult: 0, result: res });
	});
};

exports.update = function (org, done) {
    Collection.findByIdAndUpdate(org._id, org, {}, function (err) {
        if (err) return done(errorBuilder(err));
        done({ operationResult: 0, result: org });
    });
}

exports.getByName = function(name, done){

	Collection.findOne({organizationName: name}, function(err, organization) {
		if(err) return done({operationResult:1, error:err});
		done({operationResult:0, result: organization});
	});
}

exports.getByBin = function (bin, done) {
    Collection.findOne({ bin: bin }, function (err, org) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: org});
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
