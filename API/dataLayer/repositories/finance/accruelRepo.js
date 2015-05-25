var Q = require('q');
var AccruelDef = require('../../models/finance/accruel');
var Collection =new require('../../../helpers/mongoose/modelBuilder')('Accruel', AccruelDef);

exports.add = function(accruel){		
	var deferred = Q.defer();

	var model = Collection(accruel);
	model.save(function(err) {
		if (err){
			deferred.reject({operationResult:1, error:err});
			return;
		}
		deferred.resolve({operationResult:0});
	});

	return deferred.promise;
};