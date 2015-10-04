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
    clientTypeFiz = data.result[0]._doc;
});

var workbook = XLS.readFile('inputData/clientFiz.xls');
var sheet_name_list = workbook.SheetNames;
var sheet = workbook.Sheets[sheet_name_list[0]];
var data = XLS.utils.sheet_to_json(sheet, {header: 1});
data = _.rest(data, 1);
//data = data.slice(57900);
console.log('clientFiz readed');

var workbook = XLS.readFile('inputData/vodomerFiz.xls');
var sheet_name_list = workbook.SheetNames;
var sheet = workbook.Sheets[sheet_name_list[0]];
var vodomerData = XLS.utils.sheet_to_json(sheet, {header: 1});
vodomerData = _.rest(vodomerData, 1);
console.log('vodomerFiz readed');

var clients = [];
var i = 0;

clientTypeFizRepo.getAll(function (types) {
    var clientTypes = types.result;
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
        // Чистим коллекцию clientfizs, убираем на время ref в моделях clientfiz, clienttypefiz

        function (callback) {

            function makeClient(row) {
                var vodomer = _.find(vodomerData, function (rowV) {
                    return rowV[1] == row[2];
                });
                var counters = [];
                if (vodomer) {
                    var date = null;
                    if (row[39]) {
                        var dateRow = row[39].trim();
                        if (dateRow.indexOf('.') != -1) {
                            var dateArr = dateRow.split('.');
                            date = new Date(dateArr[2], dateArr[1], dateArr[0]);
                        } else {
                            var dateArr = dateRow.split('/');
                            date = new Date(dateArr[2], dateArr[0], dateArr[1]);
                        }
                    }
                    counters.push({
                        counterNumber: vodomer[2] ? vodomer[2].trim() : null,
                        plumbNumber: vodomer[4] ? vodomer[4].trim() : null,
                        currentStatus: vodomer[4] ? '#Опломбирован' : '#Не обломбирован',
                        problem: null,
                        problemDescription: null,
                        dateOfLastCounts: date,
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
                    name: row[3] ? row[3] : '',
                    bin: '',
                    rnn: '',
                    site: row[1],

                    addressId: row[70],
                    address: row[71],
                    phone: null,
                    email: null,
                    period: 201509,
                    pipelines: clientPipelines,

                    controllerId: null,
                    clientType: _.find(clientTypes, function (type) {
                        return type._doc.name == row[18] ? row[18].trim() : 'абонент';
                    })._doc,
                    waterPercent: clientPipelines[0].waterPercent,
                    canalPercent: clientPipelines[0].canalPercent,
                    norm: 0,
                    checkByNorm: counters.length == 0 ? true : false
                };
                return newClient;
            }

            function getAddress(row, done) {
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
                                        done({
                                            addressId: foundFlat._doc._id,
                                            address: street.result._doc.value + ' ' + foundHouse._doc.value + ' ' + foundFlat._doc.value
                                        });
                                    });
                                } else {
                                    done({
                                        addressId: foundHouse._doc._id,
                                        address: street.result._doc.value + ' ' + foundHouse._doc.value
                                    });
                                }
                            });
                        } else {
                            done({
                                addressId: street.result._doc._id,
                                address: street.result._doc.value
                            });
                        }
                    });
                } else {
                    done({
                        addressId: null,
                        address: null
                    });
                }
            }

            var indexInData = 0;

            function addClientToRepo() {
                setTimeout(function () {
                    var row = data[indexInData++];
                    var client = makeClient(row);
                    getAddress(row, function (address) {
                        client.addressId = address.addressId;
                        client.address = address.address;
                        clientFizRepo.add(client, function (response) {
                            if (response.operationResult != 0) {
                                console.log(JSON.stringify(response.result[0].errors));
                            } else {
                                console.log(indexInData);
                                if (indexInData < data.length) {
                                    addClientToRepo();
                                } else {
                                    console.log('Done');
                                    callback();
                                }
                            }
                        });
                    });
                });
            }

            addClientToRepo();
        }

        //\\ ФИЗИКИ

    ], function (error, results) {
        console.log('DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE');
    });
});