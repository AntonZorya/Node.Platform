var TestRepo = require('../dataLayer/repositories/test/TestRepo');
var express = require('express');
var app = express();
var ODataServer = require("simple-odata-server");
var MongoClient = require('mongodb').MongoClient;
var http = require('http');


//require('jaydata');
//window.DOMParser=require('xmldom').DOMParser;
require('q');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var errorhandler = require('errorhandler');

require("odata-server");


exports.main = function () {


var model = {
    namespace: "ns",
    entityTypes: {
        "_ClientJoinedAndAggregated": {
            "accountNumber": {"type": "Edm.Number"},
            "name": {"type": "Edm.String"},            
        }
    },   
    entitySets: {
        "_ClientJoinedAndAggregated": {
            entityType: "ns._ClientJoinedAndAggregated"
        }
    }
};


MongoClient.connect('mongodb://192.168.66.27/BillingController', function(err, db) {
    var odataServer = ODataServer()
    .model(model)
    .onMongo(function(cb) { cb(err, db); });

    
    app.use(function (req, res, next) {
        res.header("Content-Type",'application/json');
        next();
    });
    app.use(odataServer.handle.bind(odataServer)).listen(1338);
});






	// TestRepo.testDP(function(data){
	// 	console.log(data);
	// });
	
	// TestRepo.test(function(data){
	// 	console.log(data);
	// });
	
	// TestRepo.testMR(function(data){
	// 	console.log(data);
	// });
	
	// TestRepo.testJoin(function(data){
	// 	console.log(data);
	// });
	
	

}

exports.main2 = function(){

// require('./model.js');
// $data.Entity.extend("Todo", {
//     Id: { type: "id", key: true, computed: true },
//     Task: { type: String, required: true, maxLength: 200 },
//     DueDate: { type: Date },
//     Completed: { type: Boolean }
// });

// $data.EntityContext.extend("TodoDatabase", {
//     Todos: { type: $data.EntitySet, elementType: Todo }
// });



// $data.createODataServer({
//     responseLimit: 1000,
//     provider: {
//         server: [{ address: '192.168.66.27', port: 27017 }]
//     },    
//     checkPermission: function (access, user, entitySets, callback) {
//         console.log(access);
//         if (access & $data.Access.Read) {
//             callback.success();
//         } 
//         else callback.error('Data is read only.');
//     }
// }, '/todo', 52999);


    // $data.createODataServer(
    //     {
    //         provider: {
    //             server: [{ address: '192.168.66.27', port: 27017 }]
    //         }
    //     }, '/test', 52999, 'localhost');

    // app.use(express.query());
    // app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({ extended: true }));
    // app.use(cookieParser());
    // app.use(methodOverride());
    // app.use(session({ secret: 'session key' }));
    // app.use("/test", $data.JayService.OData.Utils.simpleBodyReader());
    // app.use("/test", $data.JayService.createAdapter(BillingController.Context, function (req, res) {
        
    //     var context = new BillingController.Context({name: "mongoDB", databaseName:"BillingController", address: "192.168.66.27", port: 27017 });
    // }));
    // app.use("/", express.static(__dirname));
    // app.use(errorhandler());
    // app.listen(1339);
    
}