var AccruelDef = require('../../models/finance/accruel');
var Collection =new require('../../../helpers/mongoose/modelBuilder')('Accruel', AccruelDef);

exports.add = function(accruel, done){
	var model = Collection(accruel);
	model.save(function(err) {
		if (err) return done({operationResult:1, error:err});
		done({operationResult:0});
	});
};