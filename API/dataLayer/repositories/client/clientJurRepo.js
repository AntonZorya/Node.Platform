var ClientJurDef = require('../../models/client/clientJur');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('ClientJur', ClientJurDef);

exports.add = function(client, done){
	var model = Collection(client);
	model.save(function(err) {
		if (err)return done(errorBuilder(err));
		done({operationResult:0});
	});
};
