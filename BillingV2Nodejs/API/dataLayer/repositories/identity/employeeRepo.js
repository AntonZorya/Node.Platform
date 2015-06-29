var EmployeeDef = require('../../models/identity/employee');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('Employee', EmployeeDef);

exports.add = function(employee, done){
	var model = Collection(employee);
	model.save(function(err) {
		if (err)return done({operationResult:1, error:err});
		done({operationResult:0});
	});
};

exports.get = function(id, done){
	Collection.findOne({ _id:id })
	.populate('organizationId')
	.exec(function (err, employee) {
		if(err) return done({operationResult:1, result:err});
		done({operationResult:0, result:employee});
	});

};

