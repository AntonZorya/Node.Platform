var ClientJurDef = require('../../models/client/clientJur');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('ClientJur', ClientJurDef);

exports.add = function(client, done){
	var model = Collection(client);
	model.save(function(err) {
		if (err)return done(errorBuilder(err));
		done({operationResult:0});
	});
};

exports.getAll = function (orgId, done) {
    Collection.find({ isDeleted: false, organizationId: orgId }, function (err, clients) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: clients});
    });
};

exports.getAllByCtrlId = function (ctrlId, done) {
    Collection.find({ isDeleted: false, controllerId: ctrlId }, function (err, clients) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: clients});
    });
};

exports.get = function (id, done) {
    Collection.findById(id, {isDeleted: false}, function(err, client){
        if(err) return done(errorBuilder(err));
        return done({operationResult: 0, result: client});
    });
};

exports.update = function (client, done) {
    if (client._id) {
        Collection.findOneAndUpdate({ _id: client._id }, client, function (err) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0, result: client});
        });
    }
    else {
        return done({ operationResult: 1, result: "#clientNotFound" });
    }
};

exports.delete = function (id, done) {
    if (id) {
        Collection.findOneAndUpdate({ _id: id }, { isDeleted: true }, function (err) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0});
        });
    } 
};