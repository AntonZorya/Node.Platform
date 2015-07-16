var ClientJurRepo = require('../dataLayer/repositories/client/clientJurRepo');
var controllerRepo = require('../dataLayer/repositories/identity/controllerRepo');
var ObjectId     = require('mongoose').Types.ObjectId;

exports.main = function () {
	var date = new Date();


	ClientJurRepo.reportCounts(201506, function(data){
		console.log(data);
	})

}