var TokenDef = require('../../models/identity/token');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('Token', TokenDef);
var moment = require('moment');

exports.add = function(token, done){		
	var model = Collection(token);
	model.validThru = model.isPermanent? moment().add(1, "M"):  moment().add(20, "m");
	model.save(function(err) {
		if (err)return done({operationResult:1, error:err});							
		done({operationResult:0});
	});
};

exports.findByToken= function(token, done){
	Collection.findOne().and([{token: token}, {isDeleted: false}]).populate("user").exec(function(err, token){
		if(err) return done({operationResult:1, error: err});
		if(token && token._doc.validThru>moment())
		{
			Collection.update({_id: token._doc._id}, {$set: {validThru:  moment().add(20, "m")}}, function(err){
			}); 
			
			done({operationResult:0, result: token});
		}else{
			done({operationResult:0, result: false});
		}
	});
}

exports.findByUserId = function(userId, done){
	Collection.findOne().and([{user: userId}, {isDeleted: false}]).exec(function(err, token){
		if(err) return done({operationResult:1, error: err});
		done({operationResult:0, result: token});
	});
}

exports.closeUserTokens = function(userId, done){
	Collection.update({user: userId}, {$set: {isDeleted: true}}, {multi: true}, function(err){
		done();
	}); 
}
