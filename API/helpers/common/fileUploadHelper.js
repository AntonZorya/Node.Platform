var multer = require('multer');
var Logic = require('../../logicLayer/files/filesLogic');
var async = require("async");

module.exports = function(app) {
    app.post('/files/upload', [multer({dest: './uploads/'}), function (req, res) {
            //console.log(req.files);
        var tmpArr = [];

        async.each(req.files, function(file){
            console.log(file);
            Logic.add(file, function(data){
               tmpArr.push(data);
            });
        }, function(err){
            console.log(tmpArr);
            res.json(tmpArr);
        });

        //_.each(req.files, function(file){
        //    Logic.add(file, function(data){
        //
        //    });
        //});

        //
        //
        //fs.readFile('./uploads/req.', function (err, data) {
        //    if (err) throw err;
        //    console.log(data);
        //});






    }]);
};