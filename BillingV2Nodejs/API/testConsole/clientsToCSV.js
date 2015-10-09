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
var fs = require('fs');

var clientRepo = require('../dataLayer/repositories/client/clientFizRepo');
var clientTypeRepo = require('../dataLayer/repositories/client/clientTypeFizRepo');
var controllerRepo = require('../dataLayer/repositories/identity/controllerRepo');
var addressFizRepo = require('../dataLayer/repositories/location/addressFizRepo');

var i = 0;
clientRepo.getAll('', function (result) {
    function clientsProc() {
        console.log(++i);
        setTimeout(function() {
            if (result.result.length > 0) {
                var client = result.result.pop();
                var s = ' \n ';
                s += '"' + client._id.toString().replace(/"/g, '""')
                    + '";"' + client.accountNumber.toString().replace(/"/g, '""')
                    + '";"' + client.name.toString().replace(/"/g, '""')
                    + '";"' + client.address.toString().replace(/"/g, '""')
                    + '";"' + client.norm.toString().replace(/"/g, '""')
                    + '";"' + client.site.toString().replace(/"/g, '""') + '"';
                fs.appendFile('report.csv', s, {}, function () {
                    clientsProc();
                });
            } else {
                console.log('done');
            }
        });
    }
    var s = '"ID";"Лицевой счет";"Наименование";"Адрес";"Норма";"Участок"'
    fs.writeFile('report.csv', s, {}, function(){
        clientsProc();
        clientsProc();
        clientsProc();
        clientsProc();
        clientsProc();
    });
});