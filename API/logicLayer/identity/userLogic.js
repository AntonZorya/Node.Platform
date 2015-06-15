var UserRepo = require(_repositoriesPath+'identity/userRepo');
var TokenLogic = require('./tokenLogic');
var moment = require('moment');
var loginValidator = require(_helpersMongoosePath+'validator');
var loginDefinition = require(_viewModelsPath + 'login');
var OrganizationDef = require("../../dataLayer/models/identity/organization");
var OrgLogic = require("./organizationLogic");
var roleDefinitions = require("../../dataLayer/security/roleDefinitions");

exports.add = function(user, done){
	UserRepo.add(user, function(data){
		done(data);
	});
}

exports.check = function(model, done){
	
	loginValidator('login', loginDefinition, model, function(validationRes){
		if(validationRes.operationResult==0){
			UserRepo.getByUserName(model.userName, function(data){
				if(data.operationResult==0 && data.result)
				{
					if(data.result.password == model.password)
					{
						TokenLogic.findByUserId(data.result._doc._id, function(token){
							if(token.operationResult==0 && token.result && token.result._doc.validThru>moment())
							{
								return done({operationResult:0, result: token.result._doc.token});
							}else{
								require('crypto').randomBytes(48, function(ex, buf) {
									var generatedToken = buf.toString('hex');
									TokenLogic.closeUserTokens(data.result._doc._id, function(){


										var newToken = {user: data.result._doc._id, token: generatedToken, isPermanent: model.rememberMe? true: false};
										TokenLogic.add(newToken, function(tokenInsertionResult){

											if(tokenInsertionResult.operationResult==0)
												return done({operationResult:0, result: newToken.token});
										});
									});
								});
							}	
						});
					}else{
						return done({operationResult:3, result: ["#wrong userName or password"]});
					}

				}else{
					return done({operationResult:3, result: ["#wrong userName or password"]});
				}

			});

		} else{
			return done({operationResult:2, result: validationRes.result});
		}
	});
}


exports.register = function (regVM, done) {
    OrgLogic.getByBin(regVM.org.bin, function (res) {
        if (res.result != null)
            return done({ operationResul: 2, result: ["#организация с таким БИН/ИИН уже зарегистрирована"] });
        else
            OrgLogic.add(regVM.org, function (addRes) {
                if (addRes.operationResult === 0) {
                    regVM.user.organizationId = addRes.result._id;
                    regVM.user.roles = [roleDefinitions.organizationAdmin];
                    UserRepo.add(regVM.user, function (data) {
                        return done(data);
                    });
                }
                else {
                    return done(addRes);
                }
            });
    });
}