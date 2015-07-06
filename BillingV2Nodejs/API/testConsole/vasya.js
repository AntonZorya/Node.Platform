var ClientJurRepo = require('../dataLayer/repositories/client/clientJurRepo');


exports.main = function () {
	ClientJurRepo.report(201506, function(data){
		console.log(data.result);
	});
}