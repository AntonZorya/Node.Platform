var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');
var phones = require(_modelsPath + 'client/phones').definition;
var clientCounters = require(_modelsPath + 'client/clientCounters').definition;
var tariff = require(_modelsPath + 'tariff/tariff').definition;

exports.definition = _.extend({
    accountNumber: {type: String},
    number: {type: String},
    name: {type: String, required: "#name required"},
    bin: {type: String, required: "#bin required"},
    rnn: {type: String},
    //location
    address: {type: String, required: "#address required"},
    districtId: {type: Schema.Types.ObjectId}, //TODO: справочник –айонов и ref к ним
    streetId: {type: Schema.Types.ObjectId, ref: 'Street'},
    house: {type: String}, //TODO: справочник домов и ref к ним
    floor: {type: Number},//этаж
    floorsTotal: {type: Number}, //всего этажей
    ap: {type: String},//TODO: справочник квартир и ref к ним
    area: {type: Number},//площадь
    phone: {type: String},
    email: {type: String},
    //!location
    period: {type: Number},
    counters: clientCounters,
    controllerId: {type: Schema.Types.ObjectId, ref: 'Controller', required: true},
    clientTypeId: {type: Schema.Types.ObjectId, ref: 'ClientType', required: true},
    isCounter: {type: Boolean},
    waterPercent: {type: Number},
    canalPercent: {type: Number},
    kskId: {type: Schema.Types.ObjectId, ref: 'ksk'},
    abonentEntryDate: {type: Date},
    tariff: tariff
}, ModelBase);


//TODO реализовать db.clientjurs.createIndex(
//{ "$**": "text" },
//{ name: "TextIndex" }
//)
//exports.compoundIndex = [];


