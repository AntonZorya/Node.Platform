var OrganizationRepo = require('../../dataLayer/repositories/identity/organizationRepo');
var async = require("async");


exports.add = function(organization, done){

	OrganizationRepo.getByName(organization.organizationName, function(data){
		if(data.result==null){
			OrganizationRepo.add(organization, function(data){
				done(data);
			});
		}
	});
}

exports.getAll = function(done){

	OrganizationRepo.getAll(function(data){
		done(data);
	});
}





