_rootPath = __dirname + '/..';
_modelsPath = _rootPath + '/dataLayer/models/';
_viewModelsPath = _rootPath + '/dataLayer/viewmodels/';
_repositoriesPath = _rootPath + '/dataLayer/repositories/';
_helpersCommonPath = _rootPath + '/helpers/common/';
_helpersMongoosePath = _rootPath + '/helpers/mongoose/';
_helpersPassportPath = _rootPath + '/helpers/passport/';
_logicPath = _rootPath + '/logicLayer/';
global.errorBuilder = require('../helpers/mongoose/errorBuilder').buildError;

global.rootRequire = function (name) {
    return require(__dirname + '/../' + name);
}

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BillingController'); // connect to our database

global._ = require('underscore');
var XLS = require('xlsjs');
var async = require('async');

var collection = rootRequire('dataLayer/repositories/client/clientFizRepo').collection;
var controllerFizRepo = require('../dataLayer/repositories/identity/controllerFizRepo');

var workbook = XLS.readFile('../inputData/fizZhanat.xls');
var sheet_name_list = workbook.SheetNames;
var sheet = workbook.Sheets[sheet_name_list[0]];
var data = XLS.utils.sheet_to_json(sheet, {header: 1});
data = _.rest(data, 1);
//data = data.slice(57831);
console.log('clientFiz readed');

var controllers;

var index = 0;
function updateClientFiz() {
    if (index > 60000) {
        console.log('end');
        return;
    }
    setTimeout(function () {
        var row = data[index++];
        if (row && row[0] && row[6]) {
            var controller = _.find(controllers, function (controller) {
                return controller._doc.fullName == row[6].trim();
            });
            if (controller) {
                collection.update({
                    _id: row[0].trim().replace(/"/g, '')
                }, {
                    $set: {
                        controllerId: controller._doc._id
                    }
                }, function (err, result) {
                    if (err) console.log(err);
                    console.log(index);
                    updateClientFiz();
                });
            } else updateClientFiz();
        } else {
            updateClientFiz();
        }
    });
}

controllerFizRepo.getAll(function (result) {
    if (result.operationResult != 0) console.error(result.result);
    else {
        controllers = result.result;
        updateClientFiz();
    }
});