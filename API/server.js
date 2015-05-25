var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var passport = require('./helpers/passport/passportInit');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://192.168.66.27/toxakz'); // connect to our database

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();         



//Passport
passport.init(app);
passport.secureRoutes(app, passport);
//!Passport



//Наши роуты
require('./helpers/common/controllersRequirer')(router, "controllers", passport);
//!Наши роуты

app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);



require('./testConsole/toxa').main();
require('./testConsole/vasya').main();