var TestRepo = require('../dataLayer/repositories/test/TestRepo');

exports.main = function () {

	TestRepo.testDP(function(data){
		console.log(data);
	});
	
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