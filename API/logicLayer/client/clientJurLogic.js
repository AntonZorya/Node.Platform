var ClientJurRepo = require('../../dataLayer/repositories/client/clientJurRepo');
var clientJurValidator = require(_helpersMongoosePath + 'validator');
var clientJurDefinition = require(_modelsPath + 'client/clientJur');


exports.add = function (clientJur, done) {

	clientJurValidator('clientJur', clientJurDefinition, clientJur, function (validationRes) {
		if (validationRes.operationResult == 0) {
			ClientJurRepo.add(clientJur, function (data) {
				done(data);
			});
		}
		else {
			done(validationRes);
		}
	});
};




