var controllerDef = require('../../models/identity/controllers');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('Controller', controllerDef);
var ObjectId     = require('mongoose').Types.ObjectId;

exports.add = function(controller, done){		
	var model = Collection(controller);
	model.save(function(err) {
		if (err) return done(errorBuilder(err));							
		return done({ operationResult: 0, result: model });
	});
};

exports.getById = function (id, done) {
    Collection.findById(id, function (err, res) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: res});
    });
}


exports.getByName = function (fullName, done) {
    Collection.findOne({"fullName": fullName, isDeleted: false}, function (err, res) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: res});
    });
}

exports.getByCode = function (code, done) {
    Collection.findOne({"code": code}, function (err, res) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: res});
    });
}

exports.getAll = function (done) {
    Collection.find({ isDeleted: false }, function (err, clients) {
        if (err) return done(errorBuilder(err));
        done({operationResult: 0, result: clients});
    });
};