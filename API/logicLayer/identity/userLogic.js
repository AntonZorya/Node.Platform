var UserRepo = require('../../dataLayer/repositories/identity/userRepo');
var TokenLogic = require('./tokenLogic');
var moment = require('moment');


exports.add = function(user, done){
	UserRepo.add(user, function(data){
		done(data);
	});
}

exports.check = function(userName, password, rememberMe, done){
	UserRepo.getByUserName(userName, function(data){
		if(data.operationResult==0 && data.result)
		{
			if(data.result.password == password)
			{
				TokenLogic.findByUserId(data.result._doc._id, function(token){
					if(token.operationResult==0 && token.result && token.result._doc.validThru>moment())
					{
						return done({operationResult:0, result: token.result._doc.token});
					}else{
						require('crypto').randomBytes(48, function(ex, buf) {
							var generatedToken = buf.toString('hex');
							TokenLogic.closeUserTokens(data.result._doc._id, function(){


								var newToken = {user: data.result._doc._id, token: generatedToken, isPermanent: rememberMe? true: false};
								TokenLogic.add(newToken, function(tokenInsertionResult){

									if(tokenInsertionResult.operationResult==0)
										return done({operationResult:0, result: newToken.token});
								});
							});
						});
					}	
				});
			}else{
				return done({operationResult:0, result: false});
			}

		}else{
			return done({operationResult:0, result: false});
		}
		
	});
}