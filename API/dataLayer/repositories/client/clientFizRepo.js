var ClientFizDef = require('../../models/client/clientFiz');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('ClientFiz', ClientFizDef);

exports.add = function(client, done){
	var model = Collection(client);
	model.save(function(err) {
		if (err)return done(errorBuilder(err));
		done({operationResult:0});
	});
};

exports.getAll = function (done) {
    Collection.find({ isDeleted: false }, function (err, clients) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: clients});
    });
};