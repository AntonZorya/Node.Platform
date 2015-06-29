var DocumentRef = require('../../models/document/Document');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('Document', DocumentRef);

exports.add = function(document, done){
	var model = Collection(document);
	model.save(function(err, document) {
		if (err)return done(errorBuilder(err));
		done({operationResult:0, result: document});
	});
};