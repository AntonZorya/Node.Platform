var UserDef = require('../../models/identity/user');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('User', UserDef);
var ObjectId     = require('mongoose').Types.ObjectId;

exports.add = function(user, done){		
	var model = Collection(user);
	model.save(function(err) {
		if (err) return done(errorBuilder(err));							
		return done({ operationResult: 0, result: model });
	});
};

exports.update = function (user, done) {
    Collection.findByIdAndUpdate(user._id, user, function (err, data) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: data});
    })
}

exports.getByUserName=function(userName, done){
	Collection.findOne({"userName": userName, isDeleted: false}, function(err, user){
		if (err)return done(errorBuilder(err));
		return done({operationResult:0, result: user});
	})
}

exports.getByOrganizationId = function (orgId, done) {
    Collection.find({ organizationId: orgId, isDeleted: false }, function (err, res) {
        if (err) return done(errorBuilder(err));
        return done({ operationResult: 0, result: res });
    });
}

exports.delete = function (id, done) {
    Collection.findByIdAndUpdate(id, { isDeleted: true }, function (err) {
        if (err) return done(errorBuilder(err, data));
        return done({operationResult: 0, result: data});
    });
}

exports.changePassword = function (id, password, done) {
    Collection.findByIdAndUpdate(id, { password: password }, function (err) {
        if (err) return done(errorBuiler(err));
        return done({ operationResult: 0 });
    });
}


exports.get = function (id, done) {
    Collection.findById(id, function (err, res) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: res});
    });
}
