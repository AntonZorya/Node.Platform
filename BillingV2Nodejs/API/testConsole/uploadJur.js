global.rootRequire = function (name) {
    return require(__dirname + '/../' + name);
}

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BillingController'); // connect to our database

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

var addressRepo = rootRequire('dataLayer/repositories/location/addressRepo');
var addressTypeRepo = rootRequire('dataLayer/repositories/location/addressTypeRepo');
var controllerRepo = rootRequire('dataLayer/repositories/identity/controllerRepo');
var clientRepo = rootRequire('dataLayer/repositories/client/clientJurRepo');
var clientTypeRepo = rootRequire('dataLayer/repositories/client/clientTypeRepo');

var XLS = require('xlsjs');
var workbook = XLS.readFile('inputData/workbook v13.xls');
var sheet_name_list = workbook.SheetNames;
var sheet = workbook.Sheets[sheet_name_list[0]];
console.log('reading');
var someData = XLS.utils.sheet_to_json(sheet, {header: 1});
someData = _.rest(someData, 1);
console.log('readed');

async.each(someData, function (row, eachDone) {
    if (row[5]) {
        addressRepo.getByValue(row[5].trim(), function (data) {
            var street = data.result._doc;
            if (row[6]) {
                addressRepo.getChildrenByParentId(street._id, function (data) {
                    var house = _.find(data.result, function (item) {
                        return item._doc.value == row[6].trim();
                    });
                    if (row[7]) {
                        addressRepo.getChildrenByParentId(house._doc._id, function (data) {
                            var flat = _.find(data.result, function (item) {
                                return item._doc.value == row[7].trim();
                            });
                            row[10] = flat._doc._id.toString();
                            eachDone();
                        });
                    } else {
                        row[10] = house._doc._id.toString();
                        eachDone();
                    }
                });
            } else {
                row[10] = street._id.toString();
                eachDone();
            }
        });
    } else {
        row[10] = null;
    }
}, function () {
    console.log('Address done');
});

var uniqData = _.uniq(someData, false, function (row) {
    return [row[2], row[3], row[10]].join();
});

var clients = [];

async.each(uniqData, function (row, eachDone) {
    var tmpArr = _.filter(someData, function (item) {
        return (item[2] == row[2])
            && (item[3] == row[3])
            && (item[10] == row[10])
    });

    var counters = [];
    _.each(tmpArr, function (cntRow) {
        counters.push({
            counterNumber: cntRow[8],
            plumbNumber: cntRow[9],
            currentStatus: cntRow[9] ? 'Опломбирован' : 'Не опломбирован',
            problem: cntRow[31] ? cntRow[31] : "",
            problemDescription: cntRow[32] ? cntRow[32] : "",
            dateOfLastCounts: null,
            isActive: true,

            //текущий  период
            //dateOfCurrentCounts: null,
            //lastCounts: cntRow[13] ? cntRow[13] : null,
            //currentCounts: null

            //предыдущий период
            dateOfCurrentCounts: null, //Date.parse(cntRow[10]),
            lastCounts: cntRow[12] ? cntRow[12] : null,
            currentCounts: cntRow[13] ? cntRow[13] : null//null,
        });
    });

    var pipelines = [];
    _.each(counters, function (counter, index) {

        pipelines.push({
            number: index + 1,
            description: "Ввод" + row[4],
            addressId: row[10],
            counters: [counter],
            sourceCounts: 1,
            waterPercent: row[14] ? row[14].replace('%', '') : 0,
            canalPercent: row[15] ? row[15].replace('%', '') : 0,

            isActive: true
        });

    });

    controllerRepo.getByName(row[35].trim(), function (controller) {
        clientTypeRepo.getByName(row[33].trim(), function (clientType) {

            //var addressId = '000000000000000000000000';

            clients.push({
                accountNumber: 1,
                number: row[0],
                name: row[3],
                bin: row[2] ? row[2] : 'No bin',
                rnn: row[1] ? row[1] : 'No rnn',
                address: row[4] ? row[4] : 'No address',
                addressId: row[10],
                period: 201509,
                pipelines: pipelines,
                controllerId: controller.result ? controller.result._id : null,
                clientType: clientType.result ? clientType.result._doc : null
            });
            eachDone();
        });
    });

}, function () {
    console.log('Add is start');
    addClients();
});

function addClients(){
    setTimeout(function(){
        if (clients.length > 0){
            var client = clients.pop();
            clientRepo.add(client, function(result){
                if (result.operationResult != 0){
                    console.log(result.result);
                    console.log(JSON.stringify(client));
                }
                console.log(clients.length);
                addClients();
            });
        }else{
            console.log('DONE!!!!!!!!!!!!!!!!!!');
        }
    });
}