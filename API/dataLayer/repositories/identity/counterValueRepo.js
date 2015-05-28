var CounterValueDef = require('../../models/identity/counterValue');
var Collection = require('../../../helpers/mongoose/modelBuilder')('CounterValue', CounterValueDef);

exports.add = function(counterValue, done) {

	var model = Collection(counterValue);
	model.save(function(err) {
		if(err) done({ operationResult: 1, error: err });
		else done({ operationResult: 0 });
	});
};