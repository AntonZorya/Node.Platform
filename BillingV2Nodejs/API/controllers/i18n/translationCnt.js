var Logic = require(_logicPath+'i18n/translationLogic');

module.exports = function(router){
	
	router.route('/translation').
	post(function(req, res){
		Logic.add(req.body, function(data){
			operationResultBuilder(data, res);
		});
	});
	
	router.route('/translation').
	get(function(req, res){
		Logic.getByText(req.body, function(data){
			operationResultBuilder(data, res);
		});
	});

	//ожидаем в req.body одну перменую languageCode
	router.route('/translations').
	get(function(req, res) {
		Logic.getAllTranslations(req.query, function(data){
			operationResultBuilder(data, res);
		});
	});
	
	router.route('/translations').
	post(function(req, res) {
		Logic.updateAllTranslations(req.body, function(data){
			operationResultBuilder(data, res);
		});
	});
};