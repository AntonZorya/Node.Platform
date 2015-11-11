var mbClientConn = require('../../helpers/mbConnection/mbConnection');
var mbClient = mbClientConn(function (isReconecting) {
});

var async = require('async');

var mongoose = require('mongoose');
var Grid = require('gridfs');
var gfs = Grid(mongoose.connection.db, mongoose.mongo);

var clientJurRepo = require('../../dataLayer/repositories/client/clientJurRepo');
var calculationRepo = require('../../dataLayer/repositories/calculations/calculationRepo');

module.exports = function (router) {

    router.route("/files/docx/getFilledPDF")
        .get(function (req, res) {
            var templateId = req.query.templateId;
            var clientId = req.query.clientId;

            clientJurRepo.get(clientId, function (client) {

                if (client.operationResult == 0) {
                    client = client.result;

                    calculationRepo.getByPeriodAndClientId(client.period, client._id, function (calcs) {
                        if (calcs.operationResult == 0) {
                            calcs = calcs.result;
                            var date = new Date();
                            date = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();

                            var payload = {
                                templateId: templateId,
                                fileName: 'testTemplate',
                                objToFill: {
                                    invoiceNumber: '000000000',
                                    currentDate: date,
                                    contractNumber: client.accountNumber, // номер договора
                                    contractDate: client.contractDate, // дата заключения договра
                                    clientName: client.name, // наименование абонента
                                    address: client.address, // адрес абонента
                                    bin: client.bin, // бин абонента
                                    waterCubicMeters: '', // объем водоснабжения в текущем периоде
                                    canalCubicMeters: '', // объем сточных вод в текущем периоде
                                    waterTariff: client.clientType.tariffId.water,
                                    canalTariff: client.clientType.tariffId.canal,
                                    waterSumWithoutNDS: '',
                                    canalSumWithoutNDS: '',
                                    nds: 12,
                                    waterSumNDS: '',
                                    canalSumNDS: '',
                                    waterSum: '',
                                    canalSum: '',
                                    sumWithoutNDS: '',
                                    sumNDS: '',
                                    sum: '',
                                    signatory: '',
                                    pipelines: []
                                }
                            };

                            for (var calc in calcs) {
                                payload.objToFill.waterCubicMeters += (calcs[calc].waterCubicMetersCount * 1).toFixed(2);
                                payload.objToFill.canalCubicMeters += (calcs[calc].canalCubicMetersCount * 1).toFixed(2);
                                payload.objToFill.waterSumWithoutNDS += (calcs[calc].waterSum * -1).toFixed(2);
                                payload.objToFill.canalSumWithoutNDS += (calcs[calc].canalSum * -1).toFixed(2);
                            }
                            payload.objToFill.sumWithoutNDS = (payload.objToFill.waterSumWithoutNDS * 1 + payload.objToFill.canalSumWithoutNDS * 1).toFixed(2);

                            payload.objToFill.waterSumNDS = (payload.objToFill.waterSumWithoutNDS * payload.objToFill.nds / 100).toFixed(2);
                            payload.objToFill.canalSumNDS = (payload.objToFill.canalSumWithoutNDS * payload.objToFill.nds / 100).toFixed(2);
                            payload.objToFill.sumNDS = (payload.objToFill.waterSumNDS * 1 + payload.objToFill.canalSumNDS * 1).toFixed(2);

                            payload.objToFill.waterSum = (payload.objToFill.waterSumWithoutNDS * 1 + payload.objToFill.waterSumNDS * 1).toFixed(2);
                            payload.objToFill.canalSum = (payload.objToFill.canalSumWithoutNDS * 1 + payload.objToFill.canalSumNDS * 1).toFixed(2);

                            payload.objToFill.sum = (payload.objToFill.waterSum * 1 + payload.objToFill.canalSum * 1).toFixed(2);


                            _.sortBy(client.pipelines, function (i1, i2) {
                                return i1.waterPercent > i2.waterPercent;
                            });
                            async.each(client.pipelines, function (pipeline, callback) {
                                var counter = _.find(pipeline.counters, function (counter) {
                                    return counter.isActive == true;
                                });
                                payload.objToFill.pipelines.push({
                                    address: pipeline.address,
                                    name: pipeline.description,
                                    counterNumber: counter ? counter.counterNumber : null,
                                    lastCounts: counter ? counter.lastCounts : null,
                                    currentCounts: counter ? counter.currentCounts : null,
                                    waterCubicMeters: counter ? counter.currentCounts - counter.lastCounts : null
                                });
                                callback();
                            }, function () {
                                mbClient.sendRequest('/files/docx/toFilledPDF', payload, function (error, fileRes) {
                                    if (error) {
                                        operationResultBuilder(errorBuilder(error), res);
                                    } else {
                                        if (fileRes.operationResult == 0) {
                                            client.invoiceId = fileRes.result.fileId;
                                            clientJurRepo.update(client, function (updateRes) {
                                                if (updateRes.operationResult == 0) {
                                                    updateRes.result = client.invoiceId;
                                                    operationResultBuilder(updateRes, res);
                                                } else {
                                                    operationResultBuilder(errorBuilder(updateRes), res);
                                                }
                                            });
                                        } else {
                                            operationResultBuilder(errorBuilder(fileRes), res);
                                        }
                                    }
                                });
                            });

                        } else {
                            operationResultBuilder(errorBuilder(calcs), res);
                        }
                    });
                } else {
                    operationResultBuilder(errorBuilder(client), res);
                }
            });

        });

    router.route('/files/download')
        .get(function (req, res) {
            var fileId = req.query.fileId;
            gfs.findOne({
                _id: fileId
            }, function (err, file) {
                if (err) {
                    res.sendStatus(400);
                } else {
                    res.set('Content-Disposition', 'filename=' + file.filename);
                    res.set('Content-Type', 'application/pdf');
                    gfs.createReadStream({_id: fileId}).pipe(res);
                }
            });
        });
};