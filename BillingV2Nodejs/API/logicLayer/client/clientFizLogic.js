var ClientFizRepo = require('../../dataLayer/repositories/client/clientFizRepo');
var clientFizValidator = require(_helpersMongoosePath + 'validator');
var clientFizDefinition = require(_modelsPath + 'client/clientFiz');


exports.add = function (clientFiz, orgId, done) {
	
	clientFiz.organizationId = orgId;
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

exports.getAll = function (orgId, done) {
	ClientFizRepo.getAll(orgId, function (data) {
		done(data);
	});
};

exports.get = function (id, done) {
    ClientFizRepo.get(id, function (data) {
        return done(data);
    });
};

exports.update = function (clientFiz, done) {
	clientFizValidator('clientFiz', clientFizDefinition, clientFiz, function (validationRes) {
		if (validationRes.operationResult == 0) {
			ClientFizRepo.update(clientFiz, function (res) {
				return done(res);
			});
		}
		else {
			done(validationRes);
		}
	});
};

exports.delete = function (id, done) {
	ClientFizRepo.delete(id, function (res) {
		return done(res);
	});
};
