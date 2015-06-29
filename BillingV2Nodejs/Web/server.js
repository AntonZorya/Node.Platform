var express = require('express');
var app = express();

app.use(express.static('./'));

app.listen(8091);
console.log('Magic happens on port ' + 8091);