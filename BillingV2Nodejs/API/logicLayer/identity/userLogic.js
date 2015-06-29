var UserRepo = require(_repositoriesPath+'identity/userRepo');
var controllerRepo = require(_repositoriesPath+'identity/controllerRepo');
var TokenLogic = require('./tokenLogic');
var moment = require('moment');
var loginValidator = require(_helpersMongoosePath+'validator');
var loginDefinition = require(_viewModelsPath + 'login');

var loginControllerDefinition = require(_viewModelsPath + 'loginControllers');


var OrganizationDef = require("../../dataLayer/models/identity/organization");
var OrgLogic = require("./organizationLogic");
var roleDefinitions = require("../../dataLayer/security/roleDefinitions");


exports.getById = function (id, done) {
    UserRepo.get(id, function (res) {
        return done(res);
    });
}

exports.add = function (user, orgId, done){
    UserRepo.getByUserName(user.userName, function (res) {
        if (res.operationResult == 0) {
            if (res.result != null) {
                return done({ operationResult: 3, result: ["#user with same name exist"] });
            }
            user.organizationId = orgId;
            UserRepo.add(user, function (data) {
                return done(data);
            });
        }
        else
            return done(res);
    });
}

exports.update = function (user, done) {
    UserRepo.update(user, function (data) {
        return done(data);
    });
}

exports.delete = function (id, done) {
    UserRepo.delete(id, function (data) {
        return done(data);
    });
}


exports.changePassword = function (vm, done) {
    UserRepo.change(vm.id, vm.password, function (data) {
        return done(data);
    });
}


exports.getUsersByOrganiztionId = function (organizationId, done) {
    UserRepo.getByOrganizationId(organizationId, function (data) {
        return done(data);
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
            return done({ operationResult: 3, result: ["#orgazniation with same bin already registered"] } );
        else
            OrgLogic.add(regVM.org, function (addRes) {
                if (addRes.operationResult === 0) {
                    UserRepo.getByUserName(regVM.user.userName, function (checkUserData) {
                        if (checkUserData.opeationResult == 0) {
                            if (checkUserData.result == null) {
                                regVM.user.organizationId = addRes.result._id;
                                regVM.user.roles = [roleDefinitions.organizationAdmin.sysName];
                                UserRepo.add(regVM.user, function (data) {
                                    if (data.operationResult != 0)
                                        OrgLogic.delete(addRes.result._id, function () { });
                                    return done(data);
                                });
                            }
                            else {
                                return done({ operationResult: 3, result: ["#user with same userName exist "] });
                            }
                        }
                        else {
                            return done(checkUserData);
                        }
                    });
                }
                else {
                    return done(addRes);
                }
            });
    });
}



exports.checkController = function(model, done){

    loginValidator('loginController', loginControllerDefinition, model, function(validationRes){
        if(validationRes.operationResult==0){
            controllerRepo.getByCode(model.pinCode, function(data){
                if(data.result==null)
                    return done({operationResult:3, result: ["#wrong pinCode"]});
                else
                return done(data);
            })
        } else{
            return done({operationResult:2, result: validationRes.result});
        }
    });
}