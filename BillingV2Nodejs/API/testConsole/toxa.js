// var TranslateLogic = require('../logicLayer/i18n/translationLogic');
var controllerRepo = require('../dataLayer/repositories/identity/controllerRepo');
var clientTypeRepo = require('../dataLayer/repositories/client/clientTypeRepo');
var clientJurLogic = require('../logicLayer/client/clientJurLogic');
var streetsRepo = require('../dataLayer/repositories/location/streetRepo');
var addressesRepo = require('../dataLayer/repositories/location/addressRepo');
var async = require("async");

var mongoose = require('mongoose');


function random(low, high) {
    return Math.random() * (high - low) + low;
}

exports.main = function () {

    XLS = require('xlsjs');
    var workbook = XLS.readFile('workbook.xls');
    var sheet_name_list = workbook.SheetNames;
    var sheet = workbook.Sheets[sheet_name_list[0]];
    console.log('reading');
    var someData = XLS.utils.sheet_to_json(sheet, {header: 1});
    someData = _.rest(someData, 1);
    console.log('readed');


    async.series([

            function readyWithAddresses() {
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
                                //если такого дома для улицы нет
                                if (!foundHouse) {
                                    addresses.push({
                                        _id: houseId,
                                        addressTypeId: houseTypeId,
                                        value: house,
                                        parentId: streetId
                                    });
                                } else {
                                    houseId = foundHouse._id;
                                }

                            } else {
                                addresses.push({
                                    _id: houseId,
                                    addressTypeId: houseTypeId,
                                    value: house,
                                    parentId: streetId
                                });
                            }


                            if (typeof rowArray[7] != 'undefined') {

                                var flat = rowArray[7];
                                flat = flat.toString().trim();

                                addresses.push({
                                    addressTypeId: flatTypeId,
                                    value: flat,
                                    parentId: houseId
                                });

                            }
                        }
                    }
                });

                _.each(addresses, function (addr) {
                    addressesRepo.add(addr, function () {
                        console.log('added: ' + addr.value);
                    });
                });

            },

            /*function (readyWithStreets) {

             var streets = [];

             _.each(someData, function (itemArray) {
             _.each(itemArray, function (row, i) {
             if (i === 5)
             if (typeof row != 'undefined') {
             row = row.toString().trim();
             streets.push(row); //.trim().toLowerCase();
             }
             });
             });

             var uniqStreets = _.uniq(streets);

             async.each(uniqStreets, function (row, callback) {
             streetsRepo.add({
             name: row
             }, function (result) {
             console.log(row + '  added');
             callback();
             });
             }, function () {
             readyWithStreets();
             });


             },

             /*function (readyWithTypes) {
             var organizationTypes = _.uniq(someData, true, function (row) {
             return row[27];
             });

             async.each(organizationTypes, function (row, collback) {
             clientTypeRepo.add({
             name: row[27],
             priceWater: (row[27] == "респ.бюджет" || row[27] == "гор.бюджет" || row[27] == "обл.бюджет") ? 60.31 : 127.14,
             priceKanal: (row[27] == "респ.бюджет" || row[27] == "гор.бюджет" || row[27] == "обл.бюджет") ? 87.36 : 165.49
             }, function (result) {
             console.log(row[27] + '  added');
             collback();
             });
             }, function () {
             readyWithTypes();
             });

             },
             function (readyFunction1) {
             var controllers = _.uniq(someData, true, function (row) {
             return row[29];
             });


             async.each(controllers, function (row, callback) {
             controllerRepo.add({
             fullName: row[29],
             code: random(1000, 9999)
             }, function (result) {
             console.log(row[29] + '  added');
             callback();
             });
             }, function () {
             readyFunction1();
             });


             },
             function (readyFunction2) {
             var readyJur = _.uniq(someData, true, function (row) {
             return row[3];
             });


             async.eachSeries(readyJur, function (row, callback) {

             var tmpArr = _.filter(someData, function (cntRow) {
             return cntRow[3] == row[3];
             });

             var tmpCntArr = [];
             _.each(tmpArr, function (cntRow) {
             tmpCntArr.push({
             counterNumber: cntRow[8],
             plumbNumber: cntRow[9],
             currentStatus: cntRow[9] ? 'Опломбирован' : 'Не опломбирован',
             currentCounts: cntRow[13] ? cntRow[13] : 0,
             dateOfCurrentCounts: null,
             problem: cntRow[25] ? cntRow[25] : "",
             problemDescription: cntRow[26] ? cntRow[26] : "",
             lastCounts: cntRow[12] ? cntRow[12] : 0,
             dateOfLastCounts: null,
             isCountsByAvg: false
             });
             });

             controllerRepo.getByName(row[29], function (controller) {
             clientTypeRepo.getByName(row[27], function (clientType) {

             //var addressId = '000000000000000000000000';

             var clientJur = {
             accountNumber: 1,
             number: row[0],
             name: row[3],
             bin: row[2] ? row[2] : 'No bin',
             rnn: row[1],
             address: row[4] ? row[4] : 'No address',
             addressId: '000000000000000000000000',
             /!*streetId: street.result ? street.result._id : null,
             house: row[6],
             ap: row[7],*!/
             period: 201506,
             counters: tmpCntArr,
             controllerId: controller.result ? controller.result._id : null,
             clientTypeId: clientType.result ? clientType.result._id : null,
             isCounter: row[11] != "норма",//row[11] == "норма" ? false : true,
             waterPercent: row[14] ? row[14].replace('%', '') : 0,
             canalPercent: row[15] ? row[15].replace('%', '') : 0
             };

             function clientJurAdd() {
             clientJurLogic.add(clientJur, 22, function (result) {
             console.log('Added ' + row[3] + ' number ' + row[0]);
             callback();
             });
             }

             //var str = null;
             if (row[5]) {
             var streetName = row[5];
             streetName = streetName.toString().trim();
             console.log('streetName: ' + streetName);
             addressesRepo.getByValue(streetName, function (street) {

             if (street.result) {
             clientJur.addressId = street.result._id;
             console.log('street._id: ' + street.result._id);
             if (row[6]) {
             var houseValue = row[6];
             houseValue = houseValue.toString().trim();
             console.log('houseValue: ' + houseValue);

             addressesRepo.getChildrenByParentId(street.result._id, function (houses) {

             var foundHouse = _.find(houses.result, function (house) {
             return house.value === houseValue;
             });

             if (foundHouse) {
             clientJur.addressId = (foundHouse._id).toString();

             if (row[7]) {
             var flatValue = row[7];
             flatValue = flatValue.toString().trim();
             console.log('flatValue: ' + flatValue);

             addressesRepo.getChildrenByParentId(foundHouse._id, function (flats) {
             var foundFlat = _.find(flats.result, function (flat) {
             return flat.value === flatValue;
             });
             if (foundFlat) {
             clientJur.addressId = (foundFlat._id).toString();
             clientJurAdd();
             } else { //если квартиру в справочнике не нашли
             clientJurAdd();
             }
             });
             } else {//если номера квартиры нет
             clientJurAdd();
             }
             } else { //если дом в справочнике не нашли
             clientJurAdd();
             }
             });
             } else {//если номера дома нет
             clientJur.addressId = (street.result._id).toString();
             clientJurAdd();
             }
             } else {//нет улицы (addressId == null)
             clientJurAdd();
             }
             });
             } else {
             clientJurAdd();
             }


             });
             });


             }, function () {
             readyFunction2();
             });
             }*/
        ],
        function () {
            console.log("READY !!!!READY !!!!READY !!!!READY !!!!READY !!!!READY !!!!");
        }
    )
    ;
};