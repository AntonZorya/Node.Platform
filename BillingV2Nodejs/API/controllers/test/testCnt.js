var TestRepo = require('../../dataLayer/repositories/test/testRepo');

module.exports = function (router) {
        
    router.route('/test2').
        get(function (req, res) {
            TestRepo.unwindData(function (data) {
                operationResultBuilder(data, res);
            });
        });
};