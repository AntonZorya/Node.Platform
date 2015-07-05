var ClientJurRepo = require('../../dataLayer/repositories/client/clientJurRepo');
var clientJurValidator = require(_helpersMongoosePath + 'validator');
var clientJurDefinition = require(_modelsPath + 'client/clientJur');


exports.add = function (clientJur, orgId, done) {

	clientJur.organizationId = orgId;
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

exports.getAll = function (orgId, done) {
	ClientJurRepo.getAll(orgId, function (data) {
		done(data);
	});
};

exports.getAllByControllerId = function (ctrlId, done) {
	ClientJurRepo.getAllByCtrlId(ctrlId, function (data) {
		done(data);
	});
};

exports.get = function (id, done) {
    ClientJurRepo.get(id, function (data) {
        return done(data);
    });
};

exports.update = function (clientJur, done) {
	clientJurValidator('clientJur', clientJurDefinition, clientJur, function (validationRes) {
		if (validationRes.operationResult == 0) {
			ClientJurRepo.update(clientJur, function (res) {
				return done(res);
			});
		}
		else {
			done(validationRes);
		}
	});
};

exports.delete = function (id, done) {
	ClientJurRepo.delete(id, function (res) {
		return done(res);
	});
};

