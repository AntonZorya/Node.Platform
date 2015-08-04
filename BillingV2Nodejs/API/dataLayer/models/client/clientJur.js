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
    districtId: {type: Schema.Types.ObjectId}, //TODO: ���������� ������� � ref � ���
    streetId: {type: Schema.Types.ObjectId, ref: 'Street'},
    house: {type: String}, //TODO: ���������� ����� � ref � ���
    floor: {type: Number},//����
    floorsTotal: {type: Number}, //����� ������
    ap: {type: String},//TODO: ���������� ������� � ref � ���
    area: {type: Number},//�������
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


//TODO ����������� db.clientjurs.createIndex(
//{ "$**": "text" },
//{ name: "TextIndex" }
//)
//exports.compoundIndex = [];


