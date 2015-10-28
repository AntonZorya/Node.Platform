var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');
var phones = require(_modelsPath + 'client/phones').definition;
//var clientCounters = require(_modelsPath + 'client/clientCounters').definition;
var tariff = require(_modelsPath + 'tariff/tariff').definition;
var clientType = require(_modelsPath + 'client/clientType').definition;
var clientPipelines = require(_modelsPath + 'client/clientPipelines').definition;

exports.definition = _.extend({
    accountNumber: {type: String},
    number: {type: String},
    name: {type: String, required: "#name required"},
    bin: {type: String, required: "#bin required"},
    rnn: {type: String},

    addressId: {type: Schema.Types.ObjectId, required: true},
    address: {type: String, required: "#address required"},
    phone: {type: String},
    email: {type: String},
    period: {type: Number, required: "#period required"},
    pipelines: clientPipelines,

    controllerId: {type: Schema.Types.ObjectId, ref: 'Controller', required: true},
    clientType: clientType,
    kskId: {type: Schema.Types.ObjectId, ref: 'ksk'},
    abonentEntryDate: {type: Date},
    clientId: {type: Schema.Types.ObjectId}

    //floor: {type: Number},//этаж TODO на клиенте сделать добавление floor в коллекцию "Address"
    //floorsTotal: {type: Number}, //всего этажей TODO на клиенте сделать добавление floorsTotal  в коллекцию "Address"
    //area: {type: Number},//площадь TODO на клиенте сделать добавление area в коллекцию "Address"
}, ModelBase);


//TODO реализовать db.clientjurs.createIndex(
//{ "$**": "text" },
//{ name: "TextIndex" }
//)
//exports.compoundIndex = [];


