// var TranslateLogic = require('../logicLayer/i18n/translationLogic');
var controllerRepo = require('../dataLayer/repositories/identity/controllerRepo');
var clientTypeRepo = require('../dataLayer/repositories/client/clientTypeRepo');
var clientJurLogic = require('../logicLayer/client/clientJurLogic');
var streetsRepo = require('../dataLayer/repositories/location/streetRepo');
var addressesRepo = require('../dataLayer/repositories/location/addressRepo');
//var addressesTypeRepo = require('../dataLayer/repositories/location/addressTypeRepo');
var userRepo = require('../dataLayer/repositories/identity/userRepo');
var async = require("async");

var mongoose = require('mongoose');


function random(low, high) {
    return Math.random() * (high - low) + low;
}

exports.main = function () {

    XLS = require('xlsjs');
    var workbook = XLS.readFile('workbook_201508_2.xls');
    var sheet_name_list = workbook.SheetNames;
    var sheet = workbook.Sheets[sheet_name_list[0]];
    console.log('reading');
    var someData = XLS.utils.sheet_to_json(sheet, {header: 1});
    someData = _.rest(someData, 1);
    console.log('readed');

    async.series([

            //типы адресов, перед запуском почистить коллекцию addressTypes
            /*function readyWithAddressTypes() {
             var addressTypes = [];

             addressTypes.push({

             "_id": "55c1f1d0d39acd07553e4fdd",
             "name": "Улица"
             });

             addressTypes.push({
             "_id": "55c1f5bfd39acd07553e4fdf",
             "name": "Дом"
             });

             addressTypes.push({
             "_id": "55c1f5d7d39acd07553e4fe1",
             "name": "Квартира"
             });

             addressTypes.push({
             "_id": "55c20bb0d39acd07553e4fe3",
             "name": "Район"
             });

             _.each(addressTypes, function (addrType, index) {
             addressesTypeRepo.add(addrType, function (resp) {
             if (addressTypes.length - 1 === index)
             readyWithAddressTypes();
             });
             });
             },*/
            //!типы адресов


            //адреса, перед запуском почистить коллекцию addresses
            /*function readyWithAddresses() {
             var addresses = [];
             var districtTypeId = "55c20bb0d39acd07553e4fe3";
             var streetTypeId = "55c1f1d0d39acd07553e4fdd";
             var houseTypeId = "55c1f5bfd39acd07553e4fdf";
             var flatTypeId = "55c1f5d7d39acd07553e4fe1";

             var uniqData = _.uniq(someData, true, function (itemsArray) {
             return itemsArray;
             });

             async.each(uniqData, function (rowArray) {

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

             var houseId = mongoose.Types.ObjectId();
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
             });

             _.each(addresses, function (addr) {
             addressesRepo.add(addr, function () {
             console.log('added: ' + addr.value);
             });
             }, function () {
             readyWithAddresses();
             });

             },*/
            //!адреса


            //типы клиентов, перед запуском почистить clientTypes
            /*function (readyWithTypes) {

             var clientTypeNames = [];

             _.each(someData, function (itemArray) {
             _.each(itemArray, function (row, i) {
             if (i === 33)
             if (typeof row != 'undefined') {
             row = row.toString().trim();
             clientTypeNames.push(row);
             }
             });
             });

             var uniqClientTypeNames = _.uniq(clientTypeNames);


             var newObjectIdForParentMsb = '55db1a16f96bf62c7635ae1b'; //МСБ

             clientTypeRepo.add({
             _id: newObjectIdForParentMsb,
             name: "МСБ",
             tariffId: '55bf41dad39a83c1a4ea83c9',//МСБ
             parentId: null,
             isDeleted: false,
             createDateTime: new Date()
             }, function (result) {
             console.log('clientType: ' + "МСБ" + '  added');

             async.each(uniqClientTypeNames, function (clientTypeName, callback) {

             var clientType = {
             name: clientTypeName
             };

             switch (clientTypeName) {
             //TODO областной бюджет ???
             case 'респ.бюджет':
             clientType.tariffId = '55bf43bad39a83c1a4ea83cb';
             break;
             case 'гор.бюджет':
             clientType.tariffId = '55bf43bad39a83c1a4ea83cb';
             break;
             case 'хоз.субъекты':
             clientType.tariffId = '55bf441dd39a83c1a4ea83cf';
             break;
             case 'район':
             clientType.tariffId = '55bf43ecd39a83c1a4ea83cd';
             break;
             case 'талсуат':
             clientType.tariffId = '55c9976dd39aa4ea934245a0';
             break;
             case 'кафе':
             clientType.tariffId = '55bf41dad39a83c1a4ea83c9';//МСБ
             clientType.parentId = newObjectIdForParentMsb;
             clientType.minConsumption = 25;
             break;
             case 'рестораны':
             clientType.tariffId = '55bf41dad39a83c1a4ea83c9';//МСБ
             clientType.parentId = newObjectIdForParentMsb;
             clientType.minConsumption = 110;
             break;
             case 'гостиницы':
             clientType.tariffId = '55bf41dad39a83c1a4ea83c9';//МСБ
             clientType.parentId = newObjectIdForParentMsb;
             clientType.minConsumption = 70;
             break;
             case 'азс и автомойки':
             clientType.tariffId = '55bf41dad39a83c1a4ea83c9';//МСБ
             clientType.parentId = newObjectIdForParentMsb;
             clientType.minConsumption = 160;
             break;
             case 'сауны':
             clientType.tariffId = '55bf41dad39a83c1a4ea83c9';//МСБ
             clientType.parentId = newObjectIdForParentMsb;
             clientType.minConsumption = 80;
             break;
             case 'бани':
             clientType.tariffId = '55bf41dad39a83c1a4ea83c9';//МСБ
             clientType.parentId = newObjectIdForParentMsb;
             clientType.minConsumption = 50;
             break;
             default:
             clientType.tariffId = '55bf41dad39a83c1a4ea83c9';//МСБ
             clientType.parentId = newObjectIdForParentMsb;
             break;
             }

             clientTypeRepo.add(clientType, function (result) {
             console.log('clientType: ' + clientTypeName + '  added');
             callback();
             });


             }, function () {
             readyWithTypes();
             });

             });

             },*/
            //!типы клиентов


            //контролеры и пользователи, перед запуском почистить controllers и users (где controllerId не пустой)
            /*function (readyFunction1) {
             var controllers = _.uniq(someData, true, function (row) {
             return row[35];
             });
             var userNumber = 0;
             async.each(controllers, function (row, callback) {
             var controllerId = mongoose.Types.ObjectId();
             var fullName = row[35];
             var password = 123456; //random(1000, 9999);
             controllerRepo.add({
             _id: controllerId,
             fullName: fullName,
             code: password
             }, function (result) {
             console.log(row[35] + ' controller  added');

             userRepo.add({
             userName: 'user' + (userNumber++),
             userFullName: fullName,
             password: password,
             email: '123@test.kz',
             roles: ['controller'],
             controllerId: controllerId
             }, function (userResp) {
             callback();
             });
             });
             }, function () {
             readyFunction1();
             });


             },*/
            //!контролеры и пользователи


            //клиенты, перед запуском почистить clientJur
            //function (readyFunction2) {
            //
            //    var readyJur = _.uniq(someData, true, function (row) {
            //        return row[3];
            //    });
            //
            //    async.eachSeries(readyJur, function (row, callback) {
            //
            //            var tmpArr = _.filter(someData, function (cntRow) {
            //                return cntRow[3] == row[3];
            //            });
            //
            //            var tmpCntArr = [];
            //            _.each(tmpArr, function (cntRow) {
            //                tmpCntArr.push({
            //                    counterNumber: cntRow[8],
            //                    plumbNumber: cntRow[9],
            //                    currentStatus: cntRow[9] ? 'Опломбирован' : 'Не опломбирован',
            //                    problem: cntRow[31] ? cntRow[31] : "",
            //                    problemDescription: cntRow[32] ? cntRow[32] : "",
            //                    dateOfLastCounts: null,
            //                    isActive: true,
            //
            //                    //текущий  период
            //                    //dateOfCurrentCounts: null,
            //                    //lastCounts: cntRow[13] ? cntRow[13] : null,
            //                    //currentCounts: null
            //
            //                    //предыдущий период
            //                    dateOfCurrentCounts: Date.parse(cntRow[10]),
            //                    lastCounts: cntRow[12] ? cntRow[12] : null,
            //                    currentCounts: cntRow[13] ? cntRow[13] : null//null,
            //
            //
            //                });
            //            });
            //
            //            var pipelines = [];
            //            _.each(tmpCntArr, function (counter, index) {
            //
            //                var isByCounter = null;
            //
            //                if (typeof row[11] !== 'undefined') {
            //                    isByCounter = row[11] == 'счетчик';
            //                }
            //
            //                pipelines.push({
            //                    number: index + 1,
            //                    description: "Ввод(трубопровод) по адресу: " + row[4],
            //                    addressId: null, //TODO addressId
            //                    counters: [counter],
            //
            //                    isByCounter: isByCounter,
            //                    waterPercent: row[14] ? row[14].replace('%', '') : 0,
            //                    canalPercent: row[15] ? row[15].replace('%', '') : 0,
            //
            //                    isActive: true
            //                });
            //
            //            });
            //
            //
            //            controllerRepo.getByName(row[35], function (controller) {
            //                clientTypeRepo.getByName(row[33], function (clientType) {
            //
            //                    //var addressId = '000000000000000000000000';
            //
            //                    var clientJur = {
            //                        accountNumber: 1,
            //                        number: row[0],
            //                        name: row[3],
            //                        bin: row[2] ? row[2] : 'No bin',
            //                        rnn: row[1] ? row[1] : 'No rnn',
            //                        address: row[4] ? row[4] : 'No address',
            //                        addressId: null,
            //                        period: 201508,
            //                        pipelines: pipelines,
            //                        controllerId: controller.result ? controller.result._id : null,
            //                        clientType: clientType.result ? clientType.result._doc : null
            //                    };
            //
            //                    //функция вызывается ниже
            //                    function clientJurAdd() {
            //                        clientJurLogic.add(clientJur, 22, function (result) {
            //                            console.log('Added ' + row[3] + ' number ' + row[0]);
            //                            callback();
            //                        });
            //                    }
            //
            //                    if (row[5]) {
            //                        var streetName = row[5];
            //                        streetName = streetName.toString().trim();
            //                        console.log('streetName: ' + streetName);
            //                        addressesRepo.getByValue(streetName, function (street) {
            //
            //                            if (street.result) {
            //                                clientJur.addressId = street.result._id;
            //                                console.log('street._id: ' + street.result._id);
            //                                if (row[6]) {
            //                                    var houseValue = row[6];
            //                                    houseValue = houseValue.toString().trim();
            //                                    console.log('houseValue: ' + houseValue);
            //
            //                                    addressesRepo.getChildrenByParentId(street.result._id, function (houses) {
            //
            //                                        var foundHouse = _.find(houses.result, function (house) {
            //                                            return house.value === houseValue;
            //                                        });
            //
            //                                        if (foundHouse) {
            //                                            clientJur.addressId = (foundHouse._id).toString();
            //
            //                                            if (row[7]) {
            //                                                var flatValue = row[7];
            //                                                flatValue = flatValue.toString().trim();
            //                                                console.log('flatValue: ' + flatValue);
            //
            //                                                addressesRepo.getChildrenByParentId(foundHouse._id, function (flats) {
            //                                                    var foundFlat = _.find(flats.result, function (flat) {
            //                                                        return flat.value === flatValue;
            //                                                    });
            //                                                    if (foundFlat) {
            //                                                        clientJur.addressId = (foundFlat._id).toString();
            //                                                        clientJurAdd();
            //                                                    } else { //если квартиру в справочнике не нашли
            //                                                        clientJurAdd();
            //                                                    }
            //                                                });
            //                                            } else {//если номера квартиры нет
            //                                                clientJurAdd();
            //                                            }
            //                                        } else { //если дом в справочнике не нашли
            //                                            clientJurAdd();
            //                                        }
            //                                    });
            //                                } else {//если номера дома нет
            //                                    clientJur.addressId = (street.result._id).toString();
            //                                    clientJurAdd();
            //                                }
            //                            } else {//нет улицы (addressId == null)
            //                                clientJurAdd();
            //                            }
            //                        });
            //                    } else {
            //                        clientJurAdd();
            //                    }
            //
            //
            //                })
            //                ;
            //            })
            //            ;
            //
            //
            //        },
            //        function () {
            //            readyFunction2();
            //        }
            //    )
            //    ;
            //}
            //!клиенты
        ],
        function () {
            console.log("READY !!!!READY !!!!READY !!!!READY !!!!READY !!!!READY !!!!");
        }
    )
    ;
};