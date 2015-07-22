var express = require('express');
var app = express();

app.use(express.static('./'));
var port = 9091;
app.listen(port);
console.log('Magic happens on port ' + port);