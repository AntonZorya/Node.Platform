var ApplicationDef = require(_modelsPath + 'config/application');
var Collection = new require(_helpersMongoosePath + 'modelBuilder')('Application', ApplicationDef);
var ObjectId = require('mongoose').Types.ObjectId;

exports.add = function (application, done) {
	var model = Collection(application);
	model.save(function (error) {
		if (error) return done({ operationResult: 1, result: error });
		done({ operationResult: 0 });
	});
};

exports.getById = function (id, done) {
	Collection.findOne({ _id: new ObjectId(id) }, function (error, application) {
		if (error) return done(errorBuilder(error));
		else return done({ operationResult: 0, result: application });
	});
};