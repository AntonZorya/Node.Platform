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

var clientRepo = require('../dataLayer/repositories/client/clientJurRepo');
var clientTypeRepo = require('../dataLayer/repositories/client/clientTypeRepo');

var XLS = require('xlsjs');
var workbook = XLS.readFile('inputData/clientJurTaks.xls');
var sheet_name_list = workbook.SheetNames;
var sheet = workbook.Sheets[sheet_name_list[0]];
var someData = XLS.utils.sheet_to_json(sheet, {header: 1});
var headerRow = someData[0];
someData = _.rest(someData, 1);
console.log('clients read');

var i = 0;
async.each(someData, function (row, callback) {
    if (row[0]) {
        var bin = row[0].trim();
        clientRepo.getByBin(bin, function (result) {
            if (result.operationResult != 0) {
                console.log(JSON.stringify(result.result));
            } else {
                row[14] = result.result ? 'true' : 'false';
                console.log(++i);
                callback();
            }
        });
    } else {
        callback();
    }
}, function () {
    console.log('done');
    someData.unshift(headerRow);
    var sheet = '';
    someData.forEach(function (row) {
        var strRow = '';
        for (var i = 0; i < 15; i++) {
            var cell = row[i];
            if (cell) {
                strRow += '"' + cell.replace(/"/g, '""') + '";';
            } else{
                strRow += ';';
            }
        }
        sheet += strRow + '\n';
    });
    require('fs').writeFile('report.csv', sheet, {encoding: 'utf8'}, function (err) {
        console.log(err);
    });
});

