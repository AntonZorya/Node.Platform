var UserDef = require('../../models/identity/user');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('User', UserDef);
var ObjectId     = require('mongoose').Types.ObjectId;

exports.add = function(user, done){		
	var model = Collection(user);
	model.save(function(err) {
		if (err)return done(errorBuilder(err));							
		return done({ operationResult: 0, result: model });
	});
};

exports.getByUserName=function(userName, done){
	Collection.findOne({"userName": userName}, function(err, user){
		if (err)return done(errorBuilder(err));
		return done({operationResult:0, result: user});
	})
}

exports.getByOrganizationId = function (orgId, done) {
    Collection.find({ organizationId: orgId, isDeleted: false }, function (err, res) {
        if (err) return done(errorBuilder(err));
        return done(res);
    });
}

