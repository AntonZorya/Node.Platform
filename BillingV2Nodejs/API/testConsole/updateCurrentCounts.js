_rootPath = __dirname + '/..';
_modelsPath = _rootPath + '/dataLayer/models/';
_viewModelsPath = _rootPath + '/dataLayer/viewmodels/';
_repositoriesPath = _rootPath + '/dataLayer/repositories/';
_helpersCommonPath = _rootPath + '/helpers/common/';
_helpersMongoosePath = _rootPath + '/helpers/mongoose/';
_helpersPassportPath = _rootPath + '/helpers/passport/';
_logicPath = _rootPath + '/logicLayer/';
global.errorBuilder = require('../helpers/mongoose/errorBuilder').buildError;

global._ = require('underscore');
var async = require('async');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BillingController'); // connect to our database

require('../dataLayer/repositories/balance/balanceRepo');
require('../dataLayer/repositories/balance/balanceTypeRepo');
require('../dataLayer/repositories/payment/paymentRepo');
require('../dataLayer/repositories/forfeitDetails/forfeitDetailsRepo');
require('../dataLayer/repositories/calculations/calculationRepo');

var clientJurRepo = require('../dataLayer/repositories/client/clientJurRepo');
var clientJurOldRepo = require('../dataLayer/repositories/client/clientJurOldRepo');
var clientJurLogic = require('../logicLayer/client/clientJurLogic');

var i = 0;
var bodies = [];
clientJurOldRepo.getAllWithCounts(function (result) {
    var pipelinesOld = [];
    result.result.forEach(function (client) {
        client.pipelines.forEach(function (pipeline) {
            if (pipeline.counters[0].currentCounts) {
                pipeline.name = client.name;
                pipelinesOld.push(pipeline);
            }
        });
    });
    console.log('PiplinesOld:', pipelinesOld.length);
    clientJurRepo.getAll(function (clients) {
        clients.result.forEach(function (client) {
            client.pipelines.forEach(function (pipeline) {
                var foundPipelines = _.filter(pipelinesOld, function (pipelineOld) {
                    return (pipelineOld.waterPercent == pipeline.waterPercent)
                        && (pipelineOld.canalPercent == pipeline.canalPercent)
                        && (pipelineOld.counters[0].counterNumber == pipeline.counters[0].counterNumber)
                        && (pipelineOld.counters[0].plumbNumber == pipeline.counters[0].plumbNumber)
                        && (pipelineOld.counters[0].lastCounts == pipeline.counters[0].lastCounts)
                        && (pipelineOld.name == client.name)
                });
                if (foundPipelines && foundPipelines.length == 1) {
                    pipeline.counters[0].currentCounts = foundPipelines[0].counters[0].currentCounts;
                    pipeline.counters[0].dateOfCurrentCounts = foundPipelines[0].counters[0].dateOfCurrentCounts;
                    var body = {client: client, pipeline: pipeline, counter: pipeline.counters[0], period: 201509};
                    bodies.push(body);
                }
            });
        });
        console.log('DONE');
        updates();
    });
});

function updates() {
    setTimeout(function () {
        if (bodies.length > 0) {
            clientJurLogic.updateClientCounter(bodies.pop(), '5560b2b8f7906e1047f21700', function (resp) {
                console.log(++i);
                updates();
            });
        } else{
            console.log('update done');
        }
    });
}