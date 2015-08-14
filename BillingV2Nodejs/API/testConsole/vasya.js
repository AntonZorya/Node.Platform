var TestRepo = require('../dataLayer/repositories/test/TestRepo');
var odata = require('node-odata');
var server = odata('mongodb://192.168.66.27/BillingController');

exports.main = function () {


	
	server.resource('_ClientJoinedAndAggregated', { accountNumber: Number, name: String }).get();
	
	server.listen(3000);

	// TestRepo.testDP(function(data){
	// 	console.log(data);
	// });
	
	// TestRepo.test(function(data){
	// 	console.log(data);
	// });
	
	// TestRepo.testMR(function(data){
	// 	console.log(data);
	// });
	
	// TestRepo.testJoin(function(data){
	// 	console.log(data);
	// });
	
	

}