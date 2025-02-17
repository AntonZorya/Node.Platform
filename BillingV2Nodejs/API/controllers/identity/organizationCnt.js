var Logic = require('../../logicLayer/identity/organizationLogic');

module.exports = function(router){
	router.route('/identity/organization').
	post(function(req, res) {
		Logic.add(req.body, function(data){
			
			res.json(data);
			
		})
	});

	router.route('/identity/organizations').
	get(function(req, res){
		Logic.getAll(function(data){
			res.json(data);
		})
    });

    router.route("/identity/organization")
    .get(function (req, res) {
        Logic.get(req.query.id, function (data) {
            res.json(data);
        });
    });
	

}