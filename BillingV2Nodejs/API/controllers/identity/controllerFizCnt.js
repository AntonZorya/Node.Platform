var ControllerLogic = require(_logicPath+'identity/controllerFizLogic');

module.exports = function(router){
    router.route('/controllerFizs').
        get(function(req,res){
            ControllerLogic.getAll(function(data){
                operationResultBuilder(data, res);
            })
        });

};

