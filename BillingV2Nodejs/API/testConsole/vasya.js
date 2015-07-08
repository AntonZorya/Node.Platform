var ClientJurRepo = require('../dataLayer/repositories/client/clientJurRepo');
var controllerRepo = require('../dataLayer/repositories/identity/controllerRepo');

exports.main = function () {
	ClientJurRepo.report(201506, function(data){
		console.log(data.result);
	});
	// controllerRepo.getAll(function(data){
	// 	console.log(data);
	// });
}