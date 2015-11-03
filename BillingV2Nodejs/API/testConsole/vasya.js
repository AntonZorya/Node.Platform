//var testRepo = require('../dataLayer/repositories/test/testRepo');
var clientFizRepo = require('../dataLayer/repositories/client/clientFizRepo');
var async = require('async');

exports.main = function () {


};


exports.residentCountP1 = function () {

    XLS = require('xlsjs');
    var workbook = XLS.readFile('inputData/clientFiz.xls');
    var sheet_name_list = workbook.SheetNames;
    var sheet = workbook.Sheets[sheet_name_list[0]];
    console.log('reading');

    var someData = XLS.utils.sheet_to_json(sheet, {header: 1});
    someData = _.rest(someData, 1);
    console.log('readed');

    //someData[row][col]
    //console.log(someData);
    async.eachLimit(someData, 100, function(row, callback) {

        //console.log(row);

        clientFizRepo.getByAccountNumber(row[2], function(result){
            if(result && result.operationResult==0){
                if(result.result && result.result[0]){
                    var client = result.result[0]._doc;
                    client.residentsCount = row[8];
                    clientFizRepo.update(client, function(result){
                        console.log("client "+row[0]+" Done!!!");
                        return callback();
                    });
                }
                else{
                    console.log("client with accountNumber "+row[2]+" not found in MONGO");
                    return callback();
                }
            }
            else{
                console.log("client with accountNumber "+row[2]+" not found in MONGO");
                return callback();
            }
        });

    }, function(err){
        if( err ) {
            console.log('Unexpected error');
        } else {
            console.log('Ok');
        }
    });






};


exports.residentCountP2 = function () {

    XLS = require('xlsjs');
    var workbook = XLS.readFile('inputData/fizSite10.xls');
    var sheet_name_list = workbook.SheetNames;
    var sheet = workbook.Sheets[sheet_name_list[1]];
    console.log('reading');

    var someData = XLS.utils.sheet_to_json(sheet, {header: 1});
    someData = _.rest(someData, 1);
    console.log('readed');

    //someData[row][col]
    //console.log(someData);
    async.eachLimit(someData, 100, function(row, callback) {

        //console.log(row);

        clientFizRepo.getByAccountNumber(((row[1] && row[1].length>1)?(row[1].substr(1)):"8888888888888888"), function(result){
            if(result && result.operationResult==0){
                if(result.result && result.result[0]){
                    var client = result.result[0]._doc;
                    client.residentsCount = row[6];
                    clientFizRepo.update(client, function(result){
                        console.log("client "+row[1]+" Done!!!");
                        return callback();
                    });
                }
                else{
                    console.log("client with accountNumber "+row[1]+" not found in MONGO");
                    return callback();
                }
            }
            else{
                console.log("client with accountNumber "+row[1]+" not found in MONGO");
                return callback();
            }
        });

    }, function(err){
        if( err ) {
            console.log('Unexpected error');
        } else {
            console.log('Ok');
        }
    });






};


exports.clientDefaultLoads = function() {

    var clientFactory = require("devir-mbclient");
    var clientF = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function (isReconecting) {


        clientFizRepo.getAll(null, function(result){
            if(result.operationResult==0){
                async.eachLimit(result.result, 50, function(client, callback){


                    clientF.sendRequest("/loadings/clientLoad/validate",
                        [
                            {"negotiableLoad":"5625dbedd43f1d4813f92f20","quantity":(client.residentsCount?client.residentsCount:1),"waterPercent":100,"canalPercent":100}
                        ]
                        , function (err, data) {
                            if (err) {
                                console.log("errOR>");
                                console.log(err);
                                console.log("<errOR");
                                return callback();
                            }
                            if(data.operationResult==0){
                                client.clientLoads = data.result.clientLoads;
                                client.waterTotalNormPerDay = data.result.totals.waterTotalNormPerDay;
                                client.canalTotalNormPerDay = data.result.totals.canalTotalNormPerDay;
                                clientFizRepo.update(client, function(result){
                                    console.log("client "+client.number+" Done!!!");
                                    return callback();
                                });
                            }
                            else{
                                console.log("errOR2>");
                                console.log(err);
                                console.log("<errOR2");
                                return callback();
                            }
                        });


                }, function(err){
                    if( err ) {
                        console.log('Unexpected error');
                    } else {
                        console.log('Ok');
                    }
                });
            }
            else console.log("Clients.getAll failed!!!");
        });

    });


};