var TokenRepo = require('../../dataLayer/repositories/identity/tokenRepo');

exports.add = function(token, done){
	TokenRepo.add(token, function(data){
		done(data);
	});		
}

exports.findByToken = function(token, done){
	TokenRepo.findByToken(token, function(data){
		done(data);
	});
}

exports.findByUserId = function(userId, done){
	TokenRepo.findByUserId(userId, function(data){
		done(data);
	})
}

exports.closeUserTokens = function(userId, done){
	TokenRepo.closeUserTokens(userId, function(data){
		done(data);
	});
}