var Logic = require(_logicPath+'i18n/languageLogic');

module.exports = function(router){
	
	router.route('/language/add').
	post(function(req, res){
		Logic.add(req.body, function(data){
			operationResultBuilder(data, res);
		});
	});
	
	router.route('/languages').
	get(function(req, res) {
		Logic.getAllLanguages(req.body, function(data){
			operationResultBuilder(data, res);
		});
	});
};