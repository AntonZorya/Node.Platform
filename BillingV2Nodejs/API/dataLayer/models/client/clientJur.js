var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');
var phones = require(_modelsPath + 'client/phones').definition;
var clientCounters = require(_modelsPath + 'client/pipelineCounter').definition;
var tariff = require(_modelsPath + 'tariff/tariff').definition;
var clientType = require(_modelsPath + 'client/clientType').definition;
var clientPipelines = require(_modelsPath + 'client/clientPipelines').definition;

exports.definition = _.extend({
    accountNumber: {type: String},
    number: {type: String},
    name: {type: String, required: "#name required"},
    bin: {type: String, required: "#bin required"},
    rnn: {type: String},
    //location
    addressId: {type: Schema.Types.ObjectId, ref: 'Address', required: true},
    address: {type: String, required: "#address required"},
    floor: {type: Number},//этаж
    floorsTotal: {type: Number}, //всего этажей
    area: {type: Number},//площадь
    phone: {type: String},
    email: {type: String},
    //!location
    period: {type: Number},
    pipelines: clientPipelines,
    //counters: clientCounters,
    controllerId: {type: Schema.Types.ObjectId, ref: 'Controller', required: true},
    clientType: {type: Schema.Types.ObjectId, ref: 'ClientType', required: true},
    /*    isCounter: {type: Boolean},
     waterPercent: {type: Number},
     canalPercent: {type: Number},*/
    kskId: {type: Schema.Types.ObjectId, ref: 'ksk'},
    abonentEntryDate: {type: Date}
}, ModelBase);


//TODO реализовать db.clientjurs.createIndex(
//{ "$**": "text" },
//{ name: "TextIndex" }
//)
//exports.compoundIndex = [];


