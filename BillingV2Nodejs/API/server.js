
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var passport = require('./helpers/passport/passportInit');
var cors = require('cors');
errorBuilder = require('./helpers/mongoose/errorBuilder').buildError;
operationResultBuilder = require('./helpers/common/operationOutcome').buildOperationOutcome;




app.use(cors());

//var corsOptions = {
//  origin: 'http://example.com'
//};cd



_ = require('underscore');

var mongoose = require('mongoose');
//mongoose.connect('mongodb://192.168.66.27/BillingController'); // connect to our database
mongoose.connect('mongodb://localhost/BillingController');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();         

//Регистрация путей
_rootPath = __dirname;
_modelsPath = _rootPath + '/dataLayer/models/';
_viewModelsPath = _rootPath + '/dataLayer/viewmodels/';
_repositoriesPath = _rootPath + '/dataLayer/repositories/';
_helpersCommonPath = _rootPath + '/helpers/common/';
_helpersMongoosePath = _rootPath + '/helpers/mongoose/';
_helpersPassportPath = _rootPath + '/helpers/passport/';
_logicPath = _rootPath + '/logicLayer/';
//!Регистрация поутей




//i18String registratoin
_i18nString = require(_modelsPath + 'i18n/i18nString').definition;

//!i18nString registratiom

//Passport
passport.init(app);
passport.secureRoutes(app, passport);
_checkRoles = passport.checkRoles;
//!Passport

//Наши роуты
require('./helpers/common/controllersRequirer')(router, "controllers", passport);
//!Наши роуты


//File upload
require('./helpers/files/fileUploadHelper')(app);
//!FileUpload


app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);





//require('./testConsole/toxa').main();
//require('./testConsole/vasya').main();
require('./odata/odataSvc');


// var menu = require('node-menu');
// menu._printHeader = function(){return "ARND platform"};
// menu.addDelimiter('-', 40, 'Main Menu');
// menu.addItem(
//     'Reload translations', 
//     function() {
//         console.log("Reloading translations");
//     });
// menu.addItem(
//     'Run toxa.js', 
//     function() {
//         console.log("Running toxa.js");
//     });
// menu.start();


