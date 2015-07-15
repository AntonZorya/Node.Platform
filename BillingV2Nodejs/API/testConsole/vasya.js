var ClientJurRepo = require('../dataLayer/repositories/client/clientJurRepo');
var controllerRepo = require('../dataLayer/repositories/identity/controllerRepo');
var ObjectId     = require('mongoose').Types.ObjectId;

exports.main = function () {
	var date = new Date();
	ClientJurRepo.getAll(201506, function(data){
		console.log("All:"+(new Date()-date));

	});

	var date1 = new Date();
	ClientJurRepo.get(new ObjectId("559a94078687f56a52af3395"), function(data){
		console.log("Id:"+(new Date()-date1));
		//console.log(data);
	});


}