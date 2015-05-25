var UserDef = require('../../models/identity/user');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('User', UserDef);

exports.add = function(user, done){		
	var model = Collection(user);
	model.save(function(err) {
		if (err)return done({operationResult:1, error:err});							
		done({operationResult:0});
	});
};

exports.getByUserName=function(userName, done){
	Collection.findOne({"userName": userName}, function(err, user){
		if (err)return done({operationResult:1, error:err});
		done({operationResult:0, result: user});
	})
}