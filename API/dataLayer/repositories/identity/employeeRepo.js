var Q = require('q');
var EmployeeDef = require('../../models/identity/employee');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('Employee', EmployeeDef);
var ObjectId     = require('mongoose').Types.ObjectId;


exports.add = function(employee){		
	var deferred = Q.defer();

	var model = Collection(employee);
	model.save(function(err) {
		if (err){
			deferred.reject({operationResult:1, error:err});
			return;
		}
		deferred.resolve({operationResult:0});
	});

	return deferred.promise;
};

exports.get = function(id){
	var deferred = Q.defer();

	Collection.findOne({ _id:id })
	.populate('organizationId')
	.exec(function (err, employee) {
		if(employee!=null){
			deferred.resolve({operationResult:0, result: employee});
		}
		else if(employee==null){
			deferred.resolve({operationResult:1, result: null});
		}
		else{
			if (err){
				deferred.reject({operationResult:1, error:err});
				return;
			}
			deferred.resolve({operationResult:1, result: null});
		}
	});

	return deferred.promise;

};

