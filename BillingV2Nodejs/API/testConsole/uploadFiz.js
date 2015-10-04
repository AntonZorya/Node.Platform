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

var clientFizRepo = rootRequire('dataLayer/repositories/client/clientFizRepo');
var clientTypeFizRepo = require('../dataLayer/repositories/client/clientTypeFizRepo');
var addressRepo = rootRequire('dataLayer/repositories/location/addressFizRepo');
var addressTypeRepo = rootRequire('dataLayer/repositories/location/addressTypeRepo');

var clientTypeFiz = {};
clientTypeFizRepo.getAll(function (data) {
    clientTypeFiz = data.result;
});

var workbook = XLS.readFile('inputData/clientFiz.xls');
var sheet_name_list = workbook.SheetNames;
var sheet = workbook.Sheets[sheet_name_list[0]];
var data = XLS.utils.sheet_to_json(sheet, {header: 1});
data = _.rest(data, 1);
data = data.slice(0, 10000);
console.log('clientFiz readed');

var workbook = XLS.readFile('inputData/vodomerFiz.xls');
var sheet_name_list = workbook.SheetNames;
var sheet = workbook.Sheets[sheet_name_list[0]];
var vodomerData = XLS.utils.sheet_to_json(sheet, {header: 1});
vodomerData = _.rest(vodomerData, 1);
console.log('vodomerFiz readed');

var clients = [];
var i = 0;

async.series([

    // АДРЕСА ФИЗИКОВ

    /*function (callback) {
     var addresses = [];
     var districtTypeId = mongoose.Types.ObjectId('55c20bb0d39acd07553e4fe3');
     var streetTypeId = mongoose.Types.ObjectId('55c1f1d0d39acd07553e4fdd');
     var houseTypeId = mongoose.Types.ObjectId('55c1f5bfd39acd07553e4fdf');
     var flatTypeId = mongoose.Types.ObjectId('55c1f5d7d39acd07553e4fe1');

     var i = 0;

     async.each(data, function (rowArray, eachDone) {

     if (typeof rowArray[5] != 'undefined') {

     var parentAddresses = [];

     var streetId = mongoose.Types.ObjectId().toString();
     var streetName = rowArray[5];
     streetName = streetName.toString().trim();
     var foundStreet = null;

     var newStreet = {
     _id: streetId,
     addressTypeId: streetTypeId,
     value: streetName,
     parentId: null,
     isDeleted: false,
     createDateTime: null
     };

     if (addresses.length == 0) {
     addresses.push(newStreet);
     } else {
     foundStreet = _.find(addresses, function (addr) {
     return addr.value == streetName;
     });
     if (!foundStreet) {
     addresses.push(newStreet);
     } else {
     streetId = foundStreet._id;
     }
     }

     if (typeof rowArray[6] != 'undefined') {

     var houseId = mongoose.Types.ObjectId().toString();
     var house = rowArray[6];
     house = house.toString().trim();

     //вытаскиваем дома улицы
     var foundHousesForStreet = _.filter(addresses, function (addr) {
     return addr.parentId === streetId;
     });
     if (foundHousesForStreet) {
     var foundHouse = _.find(foundHousesForStreet, function (h) {
     return h.value === house;
     });
     //если такого дома для улицы в базе еще нет
     if (!foundHouse) {
     addresses.push({
     _id: houseId,
     addressTypeId: houseTypeId,
     value: house,
     parentId: streetId,
     parentAddresses: [
     {
     typeId: streetTypeId,
     typeName: 'Улица',
     shortTypeName: 'ул.',
     id: streetId,
     name: streetName
     }
     ]
     });
     } else {
     houseId = foundHouse._id;
     }

     } else {
     addresses.push({
     _id: houseId,
     addressTypeId: houseTypeId,
     value: house,
     parentId: streetId,
     parentAddresses: [
     {
     typeId: streetTypeId,
     typeName: 'Улица',
     shortTypeName: 'ул.',
     id: streetId,
     name: streetName
     }
     ]

     });
     }

     if (typeof rowArray[7] != 'undefined') {

     var flat = rowArray[7];
     flat = flat.toString().trim();

     addresses.push({
     addressTypeId: flatTypeId,
     value: flat,
     parentId: houseId,
     parentAddresses: [
     {
     typeId: houseTypeId,
     typeName: 'Дом',
     shortTypeName: 'д.',
     id: houseId,
     name: house
     },
     {
     typeId: streetTypeId,
     typeName: 'Улица',
     shortTypeName: 'ул.',
     id: streetId,
     name: streetName
     }
     ]
     });

     }
     }
     }
     console.log(i++);
     eachDone();
     }, function () {
     async.each(addresses, function (addr, done) {
     addressRepo.add(addr, function () {
     console.log('Added address:', addr.value);
     done();
     });
     }, function () {
     callback();
     });
     });
     }*/

    //\\ АДРЕСА ФИЗИКОВ


    // ФИЗИКИ

    function (callback) {
        async.each(data, function (row, eachDone) {
            if (row[5]) {
                addressRepo.getByValue(row[5].trim(), function (street) {
                    if (row[6]) {
                        addressRepo.getChildrenByParentId(street.result._doc._id, function (houses) {
                            var foundHouse = _.find(houses.result, function (house) {
                                return house._doc.value == row[6].trim();
                            });
                            if (row[7]) {
                                addressRepo.getChildrenByParentId(foundHouse._id, function (flats) {
                                    var foundFlat = _.find(flats.result, function (flat) {
                                        return flat._doc.value == row[7].trim();
                                    });
                                    row[70] = foundFlat._doc._id;
                                    row[71] = street.result._doc.value + ' ' + foundHouse._doc.value + ' ' + foundFlat._doc.value;
                                    eachDone()
                                });
                            } else {
                                row[70] = foundHouse._doc._id;
                                row[71] = street.result._doc.value + ' ' + foundHouse._doc.value;
                                eachDone();
                            }
                        });
                    } else {
                        row[70] = street.result._doc._id;
                        row[71] = street.result._doc.value;
                        eachDone();
                    }
                });
            } else {
                row[70] = null;
                row[71] = null;
                eachDone();
            }
        }, function () {
            console.log('Addresses done');
        });

        function makeClient(row) {
            var vodomer = _.find(vodomerData, function (rowV) {
                return rowV[1] == row[2];
            });
            var counters = [];
            if (vodomer) {
                counters.push({
                    counterNumber: vodomer[2] ? vodomer[2].trim() : null,
                    plumbNumber: vodomer[4] ? vodomer[4].trim() : null,
                    currentStatus: vodomer[4] ? '#Опломбирован' : '#Не обломбирован',
                    problem: null,
                    problemDescription: null,
                    dateOfLastCounts: row[39] ? Date.parse(row[39].trim()) : null,
                    isActive: true,

                    dateOfCurrentCounts: null,
                    lastCounts: row[38] ? row[38].trim() : null,
                    currentCounts: null,

                    installDate: vodomer[3] ? Date.parse(vodomer[3].trim()) : null,
                });
            }
            var clientPipelines = [{
                number: 1,
                description: 'Ввод',
                addressId: null,
                counters: counters,
                sourceCounts: 0,// 0 по счетчику, 1 по среднему, 2 по норме
                waterPercent: 100,
                canalPercent: row[17] ? (row[17].substring('без канал') ? 0 : 100) : 100,

                isActive: true,
            }];
            var newClient = {
                accountNumber: row[2],
                number: row[0],
                name: row[3],
                bin: 'no bin',
                rnn: 'no rnn',
                site: row[1],

                addressId: row[70],
                address: row[71],
                phone: null,
                email: null,
                period: 201509,
                pipelines: clientPipelines,

                controllerId: null,
                clientType: clientTypeFiz,
            };
            return newClient;
        }

        var indexInData = 0;

        function addClientToRepo() {
            setTimeout(function () {
                var row = data[indexInData];
                clientFizRepo.add(makeClient(row), function (response) {
                    if (response.operationResult != 0) {
                        console.log(response.result);
                    }
                    else {
                        console.log(indexInData);
                        if (indexInData < data.length){
                            addClientToRepo();
                        } else{
                            console.log('Done');
                            callback();
                        }
                    }
                });
            });
        }

        //for(var i = 0; i < 10; i++) {
            addClientToRepo();
        //}
    }

    //\\ ФИЗИКИ

], function (error, results) {
    console.log('DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE');
});