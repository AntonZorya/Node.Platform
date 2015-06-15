var OrganizationRepo = require('../../dataLayer/repositories/identity/organizationRepo');
var async = require("async");


exports.add = function(organization, done){

	OrganizationRepo.getByBin(organization.bin, function(data){
		if(data.result==null){
			OrganizationRepo.add(organization, function(data){
                return done(data);
			});
		}
	});
}

exports.getAll = function(done){

	OrganizationRepo.getAll(function(data){
		done(data);
	});
}

exports.getByBin = function (bin, done) {
    OrganizationRepo.getByBin(bin, function (data) {
        done(data);
    });
}





