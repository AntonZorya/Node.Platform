var fs = require('fs');

module.exports = function (router) {
    router.route("/odata")
    .get(function (req, res) {
            console.log("requested");
            res.header("Content-Type",'application/atom+xml;charset=UTF-8');

            fs.readFile('odata.xml', function (err, data) {
                if (err) {
                    res.end();
                }
                else{
                    var rstream = fs.createReadStream('odata.xml', "utf8");

                    rstream.pipe(res);
                }
            });



            //res.send(file);
    });
}