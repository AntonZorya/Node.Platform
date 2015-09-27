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

var workbook = XLS.readFile('API/inputData/clientFiz.xls');
var sheet_name_list = workbook.SheetNames;
var sheet = workbook.Sheets[sheet_name_list[0]];
var clientFizExcel = XLS.utils.sheet_to_json(sheet, {header: 1});
clientFizExcel = _.rest(clientFizExcel, 1);
console.log('clientFiz readed');

var workbook = XLS.readFile('API/inputData/counterFiz.xls');
var sheet_name_list = workbook.SheetNames;
var sheet = workbook.Sheets[sheet_name_list[0]];
var counterFizExcel = XLS.utils.sheet_to_json(sheet, {header: 1});
counterFizExcel = _.rest(counterFizExcel, 1);
console.log('counterFizExcel readed');

var workbook = XLS.readFile('API/inputData/vodomerFiz.xls');
var sheet_name_list = workbook.SheetNames;
var sheet = workbook.Sheets[sheet_name_list[0]];
var vodomerFizExcel = XLS.utils.sheet_to_json(sheet, {header: 1});
vodomerFizExcel = _.rest(vodomerFizExcel, 1);
console.log('vodomerFizExcel readed');

async.series([

    function (callback) {
        var addresses = [];
        var districtTypeId = mongoose.Types.ObjectId('55c20bb0d39acd07553e4fe3');
        var streetTypeId = mongoose.Types.ObjectId('55c1f1d0d39acd07553e4fdd');
        var houseTypeId = mongoose.Types.ObjectId('55c1f5bfd39acd07553e4fdf');
        var flatTypeId = mongoose.Types.ObjectId('55c1f5d7d39acd07553e4fe1');

        var i = 0;

        async.each(clientFizExcel, function (rowArray, eachDone) {

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
        }, function(error){
            if (error){
                callback(error);
            } else{
                async.each(addresses, function(addr, done){
                    addressRepo.add(addr, function(){
                        console.log('Added address:', addr.value);
                        done();
                    });
                }, function(){
                    callback();
                });
            }
        });
    }

], function (error, results) {
    console.log('DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE');
});