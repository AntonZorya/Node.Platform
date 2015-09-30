global.rootRequire = function (name) {
    return require(__dirname + '/' + name);
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

global._ = require('underscore');
var async = require('async');

var XLS = require('xlsjs');
var workbook = XLS.readFile('inputData/workbook v13.xls');
var sheet_name_list = workbook.SheetNames;
var sheet = workbook.Sheets[sheet_name_list[0]];
console.log('reading');
var someData = XLS.utils.sheet_to_json(sheet, {header: 1});
someData = _.rest(someData, 1);
console.log('readed');

someData.sort(function (a, b) {
    return a[2] > b[2];
});
var uniqData = _.uniq(someData, false, function (row) {
    return row[3];
});

var i = 0;
async.each(uniqData, function (row, callback) {
    var foundClient = _.filter(someData, function (row1) {
        if (row1) {
            return (row1[2] + 1 == row[2])
                || (row1[2] - 1 == row[2]);
        } else {
            return false;
        }
    });
    if (foundClient.length > 0) {
        i += foundClient.length;
        console.log(i, foundClient[0][3]);
    }
    callback();
}, function (error) {
    console.log('END!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
});