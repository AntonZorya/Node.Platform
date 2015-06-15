FileRepo = require("../../dataLayer/repositories/files/filesRepo");
var async = require("async");

exports.add = function (file, done) {

console.log("someText");
    done({text:"OK"+file.originalname});



}

