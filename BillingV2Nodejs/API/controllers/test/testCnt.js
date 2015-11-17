var TestRepo = require('../../dataLayer/repositories/test/testRepo');

module.exports = function (router) {

    router.route('/test2').
        get(function (req, res) {
            if(!isOdataWorking){
                isOdataWorking = true;
                TestRepo.unwindData(function (data) {
                    isOdataWorking = false;
                });
                operationResultBuilder({operationResult: 0, result: true}, res);
            }
            else
                operationResultBuilder({operationResult: 0, result: false}, res);
        });


    router.route('/test2/status').
        get(function (req, res) {
            operationResultBuilder({operationResult: 0, result: isOdataWorking}, res);
        });
};