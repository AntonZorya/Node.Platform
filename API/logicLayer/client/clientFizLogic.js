var ClientFizRepo = require('../../dataLayer/repositories/client/clientFizRepo');
var clientFizValidator = require(_helpersMongoosePath + 'validator');
var clientFizDefinition = require(_modelsPath + 'client/clientFiz');


exports.add = function (clientFiz, done) {

	clientFizValidator('clientFiz', clientFizDefinition, clientFiz, function (validationRes) {
		if (validationRes.operationResult == 0) {
			ClientFizRepo.add(clientFiz, function (data) {
				done(data);
			});
		}
		else {
			done(validationRes);
		}
	});
};

exports.getAll = function (done) {
	ClientFizRepo.getAll(function(data){
		done(data);
	});
};
