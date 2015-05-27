var EmployeeRepo = require('../../dataLayer/repositories/identity/employeeRepo');
var OrganizationRepo = require('../../dataLayer/repositories/identity/organizationRepo');


exports.add = function(employee, done){

	OrganizationRepo.getById(employee.organizationId, function(data){
		if(data.operationResult==0){
			EmployeeRepo.add(employee, function(data){
				return done(data);
			});
		}
		else return done({operationResult:1, error:data.error});
	});
}

exports.get = function(id, done){

	EmployeeRepo.get(id, function(data){
		if(data.operationResult==0) return done(data);
		return done({operationResult:1, error:data.error});
	});
}





