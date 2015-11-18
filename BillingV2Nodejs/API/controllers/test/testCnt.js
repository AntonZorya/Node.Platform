var TestRepo = require('../../dataLayer/repositories/test/testRepo');
var fs = require("fs");
var async = require("async");

fs.unlink('odataInProgress', function (err) {});

module.exports = function (router) {



    router.route('/test2').
        get(function (req, res) {
            var odataInProgress;
            async.series([
                    function(callback){
                        fs.readFile('odataInProgress', function (err, data) {
                            if (err) {
                                odataInProgress = false;
                                callback(null, 'one');
                            }
                            else{
                                odataInProgress = true;
                                callback(null, 'one');
                            }
                        });

                    },
                    function(callback){
                        if(!odataInProgress){
                            fs.writeFile('odataInProgress', "", function (err) {
                                if(err) console.log("odataInProgress couldn't be created");

                                TestRepo.unwindData(function (data) {

                                    fs.unlink('odataInProgress', function (err) {
                                        if(err) console.log("odataInProgress couldn't be deleted");

                                    });

                                });
                                callback(null, true);
                            });
                        }
                        else{
                            callback(null, false);
                        }
                    }
                ],
                function(err, results){
                    operationResultBuilder({operationResult: 0, result: results[1]}, res);
                });
        });


    router.route('/test2/status').
        get(function (req, res) {

            fs.readFile('odataInProgress', function (err, data) {
                if (err) {
                    operationResultBuilder({operationResult: 0, result: false}, res);
                }
                else{
                    operationResultBuilder({operationResult: 0, result: true}, res);
                }
            });


        });
};