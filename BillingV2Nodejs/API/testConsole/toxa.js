// var TranslateLogic = require('../logicLayer/i18n/translationLogic');
var controllerRepo = require('../dataLayer/repositories/identity/controllerRepo');
var clientTypeRepo = require('../dataLayer/repositories/client/clientTypeRepo');
var clientJurLogic = require('../logicLayer/client/clientJurLogic');
var streetsRepo = require('../dataLayer/repositories/location/streetRepo');
var async = require("async");


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
        function (readyWithStreets) {

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
        function (readyWithTypes) {
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


            async.each(controllers, function (row, collback) {
                controllerRepo.add({
                    fullName: row[29],
                    code: random(1000, 9999)
                }, function (result) {
                    console.log(row[29] + '  added');
                    collback();
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
                        streetsRepo.getByName(row[5], function (street) {
                            clientJurLogic.add({
                                accountNumber: 1,
                                number: row[0],
                                name: row[3],
                                bin: row[2] ? row[2] : 'No bin',
                                rnn: row[1],
                                address: row[4] ? row[4] : 'No address',
                                streetId: street.result ? street.result._id : null,
                                house: row[6],
                                ap: row[7],
                                period: 201506,
                                counters: tmpCntArr,
                                controllerId: controller.result ? controller.result._id : null,
                                clientTypeId: clientType.result ? clientType.result._id : null,
                                isCounter: row[11] == "норма" ? false : true,
                                waterPercent: row[14] ? row[14].replace('%', '') : 0,
                                canalPercent: row[15] ? row[15].replace('%', '') : 0
                            }, 22, function (result) {
                                console.log('Added ' + row[3] + ' number ' + row[0]);
                                callback();
                            });


                        });

                    });
                });


            }, function () {
                readyFunction2();
            });
        }
    ], function () {
        console.log("READY !!!!READY !!!!READY !!!!READY !!!!READY !!!!READY !!!!");
    });
}