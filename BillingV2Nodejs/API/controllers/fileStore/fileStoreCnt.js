var mbClientConn = require('../../helpers/mbConnection/mbConnection');
var mbClient = mbClientConn(function (isReconecting) {
});

module.exports = function (router) {

    router.route("/files/docx/getFilledPDF")
        .get(function (req, res) {
            var payload = {
                templateId: req.query.templateId,
                body: {
                    first_name: req.query.clientName,
                    last_name: '',
                    price: req.query.clientBalance
                },
                fileName: 'testTemplate'
            };
            mbClient.sendRequest('/files/docx/toFilledPDF', payload, function (error, result) {
                if (error) {
                    operationResultBuilder(errorBuilder(error), res);
                } else {
                    operationResultBuilder(result, res);
                }
            });
        });

};