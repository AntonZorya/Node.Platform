_rootPath = __dirname + '/..';
_modelsPath = _rootPath + '/dataLayer/models/';
_viewModelsPath = _rootPath + '/dataLayer/viewmodels/';
_repositoriesPath = _rootPath + '/dataLayer/repositories/';
_helpersCommonPath = _rootPath + '/helpers/common/';
_helpersMongoosePath = _rootPath + '/helpers/mongoose/';
_helpersPassportPath = _rootPath + '/helpers/passport/';
_logicPath = _rootPath + '/logicLayer/';

global.rootRequire = function (name) {
    return require(__dirname + '/../' + name);
}

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BillingController'); // connect to our database

global._ = require('underscore');
var XLS = require('xlsjs');
var async = require('async');

var clientFizRepo = rootRequire('dataLayer/repositories/client/clientFizRepo');
var addressRepo = rootRequire('dataLayer/repositories/location/addressFizRepo');
var addressTypeRepo = rootRequire('dataLayer/repositories/location/addressTypeRepo');

var workbook = XLS.readFile('API/inputData/fiz.xls');
var sheet_name_list = workbook.SheetNames;
var sheet = workbook.Sheets[sheet_name_list[2]];
var data = XLS.utils.sheet_to_json(sheet, {header: 1});
data = _.rest(data, 1);
data = data.slice(28000, 30000);
console.log('clientFiz readed');

var i = 0;
function clientAdd(client, done) {
    console.log(i++);
    clientFizRepo.add(client, function (result) {
        console.log(client.name);
        done();
    });
}

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
            var counters = [{
                counterNumber: 1,
                currentStatus: null,
                currentCounts: null,
                dateOfCurrentCounts: null,
                problem: null,
                problemDescription: null,
                lastCounts: row[38],
                dateOfLastCounts: row[39]?new Date(row[39].replace('/', '.').trim()):null,
                hasProblem: false,
                installDate: new Date('01.01.1970'),
                checkDate: null,
                removeDate: null,
                plumbNumber: '0',
                plumbInstallDate: new Date('01.01.1970'),
                markId: null,
                fileIds: [],
                isActive: true,
                isCounterNew: false,
                isPrevAvgCalculated: false
            }];
            var clientPipelines = [{
                number: 1,
                description: '',
                addressId: null,
                counters: counters,

                waterPercent: 100,
                canalPercent: 100,

                isActive: true,

                fileIds: [],//счет фактуры,

                sourceCounts: 0,// 1 по счетчику, 2 по среднему, 3 по норме
                avg: 0, //среднее - должно расчитываться на основе предыдущих месяцев или пользователь может вбить сам
                norm: 0 //норма
            }];
            var newClient = {
                accountNumber: row[2],
                number: row[0],
                name: row[3],
                bin: 'no bin',
                rnn: '',

                addressId: null,
                address: null,
                phone: null,
                email: null,
                period: 201509,
                pipelines: clientPipelines,

                controllerId: '55fbd872cacab3a4132b387f',
                clientType: null,
                kskId: null,
                abonentEntryDate: null,

                abonentAreaNumber: null
            };

            if (row[5]){
                addressRepo.getByValue(row[5].trim(), function (street){
                    if (row[6]){
                        addressRepo.getChildrenByParentId(street.result._doc._id, function(houses){
                            var foundHouse = _.find(houses.result, function (house) {
                                return house._doc.value == row[6].trim();
                            });
                            if (row[7]){
                                addressRepo.getChildrenByParentId(foundHouse._id, function(flats){
                                    var foundFlat = _.find(flats.result, function(flat){
                                        return flat._doc.value == row[7].trim();
                                    });
                                    newClient.addressId = foundFlat._doc._id;
                                    newClient.address = street.result._doc.value + ' ' + foundHouse._doc.value + ' ' + foundFlat._doc.value;
                                    clientAdd(newClient, eachDone);
                                });
                            } else{
                                newClient.addressId = foundHouse._doc._id;
                                newClient.address = street.result._doc.value + ' ' + foundHouse._doc.value;
                                clientAdd(newClient, eachDone);
                            }
                        });
                    } else{
                        newClient.addressId = street.result._doc._id;
                        newClient.address = street.result._doc.value;
                        clientAdd(newClient, eachDone);
                    }
                });
            } else{
                newClient.addressId = null;
                newClient.address = null;
                clientAdd(newClient, eachDone);
            };

        }, function () {
            callback();
        });
    }

    //\\ ФИЗИКИ

], function (error, results) {
    console.log('DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE');
});