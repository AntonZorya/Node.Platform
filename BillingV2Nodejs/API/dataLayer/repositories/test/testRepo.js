var fs = require('fs');
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;
var MixedSchema = new Schema({ any: Schema.Types.Mixed }, { strict: false });
var AddressTypeDef = require('../../models/location/addressType');
var AddressTypeCollection = mongoose.model('AddressType', AddressTypeDef.definition, 'addressTypes');

var ClientJurDef = require('../../models/client/clientJur');
var ClientCollection = new require('../../../helpers/mongoose/modelBuilder')('ClientJur', ClientJurDef);
var ClientCollectionSchema = new require('../../../helpers/mongoose/modelBuilder')('ClientJur', ClientJurDef, true);
ClientCollectionSchema.plugin(deepPopulate, { whitelist: ['kskId', 'addressId.addressTypeId', 'controllerId', 'clientType.tariffId'] });

var CalculationDef = require('../../models/calculations/calculation');
var CalculationCollection = new require('../../../helpers/mongoose/modelBuilder')('Calculation', CalculationDef);
var CalculationCollectionSchema = new require('../../../helpers/mongoose/modelBuilder')('Calculation', CalculationDef, true);
CalculationCollectionSchema.plugin(deepPopulate, { whitelist: ['balanceId.balanceTypeId'] });

var ForfeitDetailsDef = require("../../models/forfeitDetails/forfeitDetails");
var ForfeitCollection = new require("../../../helpers/mongoose/modelBuilder")("forfeitDetails", ForfeitDetailsDef);
var ForfeitCollectionSchema = new require('../../../helpers/mongoose/modelBuilder')('forfeitDetails', ForfeitDetailsDef, true);
ForfeitCollectionSchema.plugin(deepPopulate, { whitelist: ['balanceId.balanceTypeId'] });

var ClientPopulated = mongoose.model('_ClientPopulated', MixedSchema);
var ClientPopulatedAndAggregated = mongoose.model('_ClientPopulatedAndAggregated', MixedSchema, '_ClientPopulatedAndAggregated');

var odataModel = {
    Лицевой_счет : "",
    Номер : "Edm.Double",
    Наименование : "",
    БИН : "",
    РНН : "",
    Адрес : "",
    Период : "",
    Номер_ввода : "Edm.Double",
    Описание_ввода : "",
    Процент_воды_ввода : "Edm.Double",
    Процент_канализации_ввода : "Edm.Double",
    Ввод_в_действии : "",
    Номер_счетчика : "",
    Текущий_статус_счетчика : "",
    Текущие_показания_счетчика : "Edm.Double",
    Дата_текущих_показаний_счетчика : "Edm.DateTime",
    Проблемы_счетчика : "",
    Описание_проблемы_счетчика : "",
    Предыдущие_показания_счетчика : "Edm.Double",
    Дата_предыдущих_показаний_счетчика : "Edm.DateTime",
    Номер_пломбы_счетчика : "",
    Счетчик_в_действии : "",
    Имя_контролера : "",
    Код_контролера : "",
    Тип_потребителя : "",
    Наименование_тарифа : "",
    Тариф_за_воду : "Edm.Double",
    Тариф_за_канализацию : "Edm.Double",
    Тип_баланса : "",
    Объем_начисленной_воды : "Edm.Double",
    Объем_начисленной_канализации : "Edm.Double",
    Тенге_начисленной_воды : "Edm.Double",
    Тенге_начисленной_канализации : "Edm.Double",
    Тенге_начисленной_общая: "Edm.Double",
    Потреблено_ниже_нормы : "",
    Потребление_ниже_нормы_на_м3 : "Edm.Double",
    Потребление_ниже_нормы_на_тенге : "Edm.Double",
    Дата_начисления : "Edm.DateTime",
    Сумма_штрафа : "Edm.Double",
    Дата_штрафа : "Edm.DateTime",
    Комментарий_к_штрафу : ""
};



exports.unwindData = function (done) {
    var round1Result;
    var round5Result;
    var round7Result;

    async.series([
        function (callback) {
            //ROUND1
            //ROUND1
            //ROUND1
            ClientCollection
                .find({isDeleted:false})
                .lean()
                .deepPopulate('kskId controllerId clientType.tariffId')
                .exec(function (err, docs) {
                    if (err) {
                        return callback(err, 'ROUND1 ERROR');
                    }
                    round1Result = docs;
                    callback(null, 'ROUND1 SUCCESS');
                });
            //ROUND1
            //ROUND1
            //ROUND1
        },
        function (callback) {
            //ROUND2
            //ROUND2
            //ROUND2
            mongoose.connection.db.dropCollection('_clientpopulateds', function (err, result) {
                if (err) {
                    return callback(null, 'ROUND2 ERROR');
                }
                callback(null, 'ROUND2 SUCCESS');
            });
            //ROUND2
            //ROUND2
            //ROUND2
        },
        function (callback) {
            //ROUND3
            //ROUND3
            //ROUND3
            async.eachSeries(round1Result, function (doc, callback) {
                var model = ClientPopulated(doc);

                model.save(function (err) {
                    if (err) return callback(err);
                    callback();
                });
            }, function (err) {
                if (err) {
                    return callback(err, 'ROUND3 ERROR');
                }
                callback(null, 'ROUND3 SUCCESS');
            });
            //ROUND3
            //ROUND3
            //ROUND3
        },
        function (callback) {
            //ROUND4
            //ROUND4
            //ROUND4
            ClientPopulated.aggregate(
                { $unwind: "$pipelines" },
                { $unwind: "$pipelines.counters" },
                {
                    $project: {
                        _id: 0,
                        clientJurId: "$_id",
                        phone: "$phone",
                        email: "$email",
                        abonentEntryDate: "$abonentEntryDate",
                        "Лицевой_счет": "$accountNumber",
                        "Номер": "$number",
                        "Наименование": "$name",
                        "БИН": "$bin",
                        "РНН": "$rnn",
                        "Адрес": "$address",
                        "Период": "$period",
                        pipelines_id: "$pipelines._id",
                        "Номер_ввода": "$pipelines.number",
                        "Описание_ввода": "$pipelines.description",
                        "Исходные_показания": "$pipelines.sourceCounts",
                        pipelines_addressId: "$pipelines.addressId",
                        pipelines_isByCounter: "$pipelines.isByCounter",
                        "Процент_воды_ввода": "$pipelines.waterPercent",
                        "Процент_канализации_ввода": "$pipelines.canalPercent",
                        "Ввод_в_действии": "$pipelines.isActive",
                        pipelines_fileIds: "$pipelines.fileIds",
                        pipelines_avg: "$pipelines.avg",
                        pipelines_norm: "$pipelines.norm",
                        pipelines_counters_id: "$pipelines.counters._id",
                        "Номер_счетчика": "$pipelines.counters.counterNumber",
                        "Текущий_статус_счетчика": "$pipelines.counters.currentStatus",
                        "Текущие_показания_счетчика": "$pipelines.counters.currentCounts",
                        "Дата_текущих_показаний_счетчика": "$pipelines.counters.dateOfCurrentCounts",
                        "Проблемы_счетчика": "$pipelines.counters.problem",
                        "Описание_проблемы_счетчика": "$pipelines.counters.problemDescription",
                        "Предыдущие_показания_счетчика": "$pipelines.counters.lastCounts",
                        "Дата_предыдущих_показаний_счетчика": "$pipelines.counters.dateOfLastCounts",
                        pipelines_counters_hasProblem: "$pipelines.counters.hasProblem",
                        pipelines_counters_installDate: "$pipelines.counters.installDate",
                        pipelines_counters_checkDate: "$pipelines.counters.checkDate",
                        "Номер_пломбы_счетчика": "$pipelines.counters.plumbNumber",
                        pipelines_counters_plumbInstallDate: "$pipelines.counters.plumbInstallDate",
                        pipelines_counters_markId: "$pipelines.counters.markId",
                        pipelines_counters_fileIds: "$pipelines.counters.fileIds",
                        "Счетчик_в_действии": "$pipelines.counters.isActive",
                        pipelines_counters_removeDate: "$pipelines.counters.removeDate",
                        "Имя_контролера": "$controllerId.fullName",
                        "Код_контролера": "$controllerId.code",
                        "Тип_потребителя": "$clientType.name",
                        clientType_minConsumption: "$clientType.minConsumption",
                        clientType_avgConsumption: "$clientType.avgConsumption",
                        clientType_maxConsumption: "$clientType.maxConsumption",
                        clientType_parentId: "$clientType.parentId",
                        "Наименование_тарифа": "$clientType.tariffId.name",
                        "Тариф_за_воду": "$clientType.tariffId.water",
                        "Тариф_за_канализацию": "$clientType.tariffId.canal",
                        clientType_tariffId_date: "$clientType.tariffId.date",
                        kskId_name: "$kskId.name",
                    }
                },
                { $out: "_ClientPopulatedAndAggregated" },


                function (err, result) {
                    if (err) {
                        return callback(err, 'ROUND4 ERROR');
                    }
                    callback(null, 'ROUND4 SUCCESS');
                });
            //ROUND4
            //ROUND4
            //ROUND4
        },
        function (callback) {
            //ROUND5
            //ROUND5
            //ROUND5
            CalculationCollection
                .find({isDeleted:false})
                .lean()
                .deepPopulate('balanceId.balanceTypeId')
                .exec(function (err, docs) {
                    if (err) {
                        return callback(err, 'ROUND5 ERROR');
                    }
                    round5Result = docs;
                    callback(null, 'ROUND5 SUCCESS');
                });
            //ROUND5
            //ROUND5
            //ROUND5
        },
        function (callback) {
            //ROUND6
            //ROUND6
            //ROUND6
            async.eachSeries(round5Result, function (doc, callback) {
                var props = {};
                if(doc.clientJurId) props.clientJurId = doc.clientJurId;
                if(doc.pipelineId) props.pipelines_id = doc.pipelineId;
                if(doc.counterId) props.pipelines_counters_id = doc.counterId;


                ClientPopulatedAndAggregated.findOne(props, function (err, client) {
                    if(err) return callback();
                    if(client==null) return callback();
                    ///////////////////////////////////////////////////
                    //doc, client._doc
                    console.log("calculation._id = "+doc._id);

                    clientPAAWC = {
                        clientJurId: client._doc.clientJurId,
                        phone: client._doc.phone,
                        email: client._doc.email,
                        abonentEntryDate: client._doc.abonentEntryDate,
                        "Лицевой_счет": client._doc.Лицевой_счет,
                        "Номер": client._doc.Номер,
                        "Наименование": client._doc.Наименование,
                        "БИН": client._doc.БИН,
                        "РНН": client._doc.РНН,
                        "Адрес": client._doc.Адрес,
                        "Период": client._doc.Период,

                        pipelines_id: (doc.pipelineId ? client._doc.pipelines_id : null),
                        "Номер_ввода": (doc.pipelineId ? client._doc.Номер_ввода : null),
                        "Описание_ввода": (doc.pipelineId ? client._doc.Описание_ввода : null),
                        "Исходные_показания": (doc.pipelineId ? client._doc.Исходные_показания : null),
                        pipelines_addressId: (doc.pipelineId ? client._doc.pipelines_addressId : null),
                        pipelines_isByCounter: (doc.pipelineId ? client._doc.pipelines_isByCounter : null),
                        "Процент_воды_ввода": (doc.pipelineId ? client._doc.Процент_воды_ввода : null),
                        "Процент_канализации_ввода": (doc.pipelineId ? client._doc.Процент_канализации_ввода : null),
                        "Ввод_в_действии": (doc.pipelineId ? client._doc.Ввод_в_действии : null),
                        pipelines_fileIds: (doc.pipelineId ? client._doc.pipelines_fileIds : null),
                        pipelines_avg: (doc.pipelineId ? client._doc.pipelines_avg : null),
                        pipelines_norm: (doc.pipelineId ? client._doc.pipelines_norm : null),

                        pipelines_counters_id: (doc.counterId ? client._doc.pipelines_counters_id : null),
                        "Номер_счетчика": (doc.counterId ? client._doc.Номер_счетчика : null),
                        "Текущий_статус_счетчика": (doc.counterId ? client._doc.Текущий_статус_счетчика : null),
                        "Текущие_показания_счетчика": (doc.counterId ? client._doc.Текущие_показания_счетчика : null),
                        "Дата_текущих_показаний_счетчика": (doc.counterId ? client._doc.Дата_текущих_показаний_счетчика : null),
                        "Проблемы_счетчика": (doc.counterId ? client._doc.Проблемы_счетчика : null),
                        "Описание_проблемы_счетчика": (doc.counterId ? client._doc.Описание_проблемы_счетчика : null),
                        "Предыдущие_показания_счетчика": (doc.counterId ? client._doc.Предыдущие_показания_счетчика : null),
                        "Дата_предыдущих_показаний_счетчика": (doc.counterId ? client._doc.Дата_предыдущих_показаний_счетчика : null),
                        pipelines_counters_hasProblem: (doc.counterId ? client._doc.pipelines_counters_hasProblem : null),
                        pipelines_counters_installDate: (doc.counterId ? client._doc.pipelines_counters_installDate : null),
                        pipelines_counters_checkDate: (doc.counterId ? client._doc.pipelines_counters_checkDate : null),
                        "Номер_пломбы_счетчика": (doc.counterId ? client._doc.Номер_пломбы_счетчика : null),
                        pipelines_counters_plumbInstallDate: (doc.counterId ? client._doc.pipelines_counters_plumbInstallDate : null),
                        pipelines_counters_markId: (doc.counterId ? client._doc.pipelines_counters_markId : null),
                        pipelines_counters_fileIds: (doc.counterId ? client._doc.pipelines_counters_fileIds : null),
                        "Счетчик_в_действии": (doc.counterId ? client._doc.Счетчик_в_действии : null),
                        pipelines_counters_removeDate: (doc.counterId ? client._doc.pipelines_counters_removeDate : null),

                        "Имя_контролера": client._doc.Имя_контролера,
                        "Код_контролера": client._doc.Код_контролера,
                        "Тип_потребителя": client._doc.Тип_потребителя,
                        clientType_minConsumption: client._doc.clientType_minConsumption,
                        clientType_avgConsumption: client._doc.clientType_avgConsumption,
                        clientType_maxConsumption: client._doc.clientType_maxConsumption,
                        clientType_parentId: client._doc.clientType_parentId,
                        "Наименование_тарифа": client._doc.Наименование_тарифа,
                        "Тариф_за_воду": client._doc.Тариф_за_воду,
                        "Тариф_за_канализацию": client._doc.Тариф_за_канализацию,
                        clientType_tariffId_date: client._doc.clientType_tariffId_date,
                        kskId_name: client._doc.kskId_name,

                        "Тип_баланса": (doc.balanceId ? doc.balanceId.balanceTypeId.name : null),
                        "Объем_начисленной_воды": doc.waterCubicMetersCount,
                        "Объем_начисленной_канализации": doc.canalCubicMetersCount,
                        "Тенге_начисленной_воды": doc.waterSum,
                        "Тенге_начисленной_канализации": doc.canalSum,
                        "Тенге_начисленной_общая": doc.waterSum+doc.canalSum,
                        "Потреблено_ниже_нормы": doc.isShortage,
                        "Потребление_ниже_нормы_на_м3": doc.shortageCubicMeters,
                        "Потребление_ниже_нормы_на_тенге": doc.shortageSum,
                        "Дата_начисления": doc.date
                    };

                    var model2 = ClientPopulatedAndAggregated(clientPAAWC);

                    model2.save(function(err){
                        if (err) return callback(err);
                        callback();
                    });
                    ///////////////////////////////////////////////////
                    //doc.newClient = client._doc;
                    //
                    //var model = CalculationPopulated(doc);
                    //
                    //model.save(function (err) {
                    //    if (err) return callback(err);
                    //    callback();
                    //});
                });
            }, function (err) {
                if (err) {
                    return callback(err, 'ROUND6 ERROR');
                }
                callback(null, 'ROUND6 SUCCESS');
            });
            //ROUND6
            //ROUND6
            //ROUND6
        },
        function (callback) {
            //ROUND7
            //ROUND7
            //ROUND7
            ForfeitCollection
                .find({isDeleted:false})
                .lean()
                .deepPopulate('balanceId.balanceTypeId')
                .exec(function (err, docs) {
                    if (err) {
                        return callback(err, 'ROUND7 ERROR');
                    }
                    round7Result = docs;
                    callback(null, 'ROUND7 SUCCESS');
                });
            //ROUND7
            //ROUND7
            //ROUND7
        },
        function (callback) {
            //ROUND8
            //ROUND8
            //ROUND8
            async.eachSeries(round7Result, function (doc, callback) {
                var props = {};
                if(doc.clientJurId) props.clientJurId = doc.clientJurId;


                ClientPopulatedAndAggregated.findOne(props, function (err, client) {
                    if(err) return callback();
                    if(client==null) return callback();
                    ///////////////////////////////////////////////////
                    //doc, client._doc

                    clientPAAWF = {
                        clientJurId: client._doc.clientJurId,
                        phone: client._doc.phone,
                        email: client._doc.email,
                        abonentEntryDate: client._doc.abonentEntryDate,
                        "Лицевой_счет": client._doc.Лицевой_счет,
                        "Номер": client._doc.Номер,
                        "Наименование": client._doc.Наименование,
                        "БИН": client._doc.БИН,
                        "РНН": client._doc.РНН,
                        "Адрес": client._doc.Адрес,
                        "Период": client._doc.Период,

                        //pipelines_id: (doc.pipelineId ? client._doc.pipelines_id : ""),
                        //"Номер_ввода": (doc.pipelineId ? client._doc.Номер_ввода : ""),
                        //"Описание_ввода": (doc.pipelineId ? client._doc.Описание_ввода : ""),
                        //"Исходные_показания": (doc.pipelineId ? client._doc.Исходные_показания : ""),
                        //pipelines_addressId: (doc.pipelineId ? client._doc.pipelines_addressId : ""),
                        //pipelines_isByCounter: (doc.pipelineId ? client._doc.pipelines_isByCounter : ""),
                        //"Процент_воды_ввода": (doc.pipelineId ? client._doc.Процент_воды_ввода : ""),
                        //"Процент_канализации_ввода": (doc.pipelineId ? client._doc.Процент_канализации_ввода : ""),
                        //"Ввод_в_действии": (doc.pipelineId ? client._doc.Ввод_в_действии : ""),
                        //pipelines_fileIds: (doc.pipelineId ? client._doc.pipelines_fileIds : ""),
                        //pipelines_avg: (doc.pipelineId ? client._doc.pipelines_avg : ""),
                        //pipelines_norm: (doc.pipelineId ? client._doc.pipelines_norm : ""),

                        //pipelines_counters_id: (doc.counterId ? client._doc.pipelines_counters_id : ""),
                        //"Номер_счетчика": (doc.counterId ? client._doc.Номер_счетчика : ""),
                        //"Текущий_статус_счетчика": (doc.counterId ? client._doc.Текущий_статус_счетчика : ""),
                        //"Текущие_показания_счетчика": (doc.counterId ? client._doc.Текущие_показания_счетчика : ""),
                        //"Дата_текущих_показаний_счетчика": (doc.counterId ? client._doc.Дата_текущих_показаний_счетчика : ""),
                        //"Проблемы_счетчика": (doc.counterId ? client._doc.Проблемы_счетчика : ""),
                        //"Описание_проблемы_счетчика": (doc.counterId ? client._doc.Описание_проблемы_счетчика : ""),
                        //"Предыдущие_показания_счетчика": (doc.counterId ? client._doc.Предыдущие_показания_счетчика : ""),
                        //"Дата_предыдущих_показаний_счетчика": (doc.counterId ? client._doc.Дата_предыдущих_показаний_счетчика : ""),
                        //pipelines_counters_hasProblem: (doc.counterId ? client._doc.pipelines_counters_hasProblem : ""),
                        //pipelines_counters_installDate: (doc.counterId ? client._doc.pipelines_counters_installDate : ""),
                        //pipelines_counters_checkDate: (doc.counterId ? client._doc.pipelines_counters_checkDate : ""),
                        //"Номер_пломбы_счетчика": (doc.counterId ? client._doc.Номер_пломбы_счетчика : ""),
                        //pipelines_counters_plumbInstallDate: (doc.counterId ? client._doc.pipelines_counters_plumbInstallDate : ""),
                        //pipelines_counters_markId: (doc.counterId ? client._doc.pipelines_counters_markId : ""),
                        //pipelines_counters_fileIds: (doc.counterId ? client._doc.pipelines_counters_fileIds : ""),
                        //"Счетчик_в_действии": (doc.counterId ? client._doc.Счетчик_в_действии : ""),
                        //pipelines_counters_removeDate: (doc.counterId ? client._doc.pipelines_counters_removeDate : ""),

                        "Имя_контролера": client._doc.Имя_контролера,
                        "Код_контролера": client._doc.Код_контролера,
                        "Тип_потребителя": client._doc.Тип_потребителя,
                        clientType_minConsumption: client._doc.clientType_minConsumption,
                        clientType_avgConsumption: client._doc.clientType_avgConsumption,
                        clientType_maxConsumption: client._doc.clientType_maxConsumption,
                        clientType_parentId: client._doc.clientType_parentId,
                        "Наименование_тарифа": client._doc.Наименование_тарифа,
                        "Тариф_за_воду": client._doc.Тариф_за_воду,
                        "Тариф_за_канализацию": client._doc.Тариф_за_канализацию,
                        clientType_tariffId_date: client._doc.clientType_tariffId_date,
                        kskId_name: client._doc.kskId_name,

                        "Тип_баланса": doc.balanceId.balanceTypeId.name,
                        "Сумма_штрафа": doc.balanceId.sum,
                        "Дата_штрафа": doc.date,
                        "Комментарий_к_штрафу" : doc.comment
                        //"Объем_начисленной_воды": doc.waterCubicMetersCount,
                        //"Объем_начисленной_канализации": doc.canalCubicMetersCount,
                        //"Тенге_начисленной_воды": doc.waterSum,
                        //"Тенге_начисленной_канализации": doc.canalSum,
                        //"Тенге_начисленной_общая": doc.waterSum+doc.canalSum,
                        //"Потреблено_ниже_нормы": doc.isShortage,
                        //"Потребление_ниже_нормы_на_м3": doc.shortageCubicMeters,
                        //"Потребление_ниже_нормы_на_тенге": doc.shortageSum
                    };

                    var model2 = ClientPopulatedAndAggregated(clientPAAWF);

                    model2.save(function(err){
                        if (err) return callback(err);
                        callback();
                    });
                    ///////////////////////////////////////////////////
                    //doc.newClient = client._doc;
                    //
                    //var model = CalculationPopulated(doc);
                    //
                    //model.save(function (err) {
                    //    if (err) return callback(err);
                    //    callback();
                    //});
                });
            }, function (err) {
                if (err) {
                    return callback(err, 'ROUND8 ERROR');
                }
                callback(null, 'ROUND8 SUCCESS');
            });
            //ROUND8
            //ROUND8
            //ROUND8
        },
        function(callback){
            //ROUND9
            //ROUND9
            //ROUND9
            ClientPopulatedAndAggregated
                .find()
                .lean()
                .exec(function (err, docs) {
                    if (err) {
                        return callback(err, 'ROUND9 ERROR');
                    }

                    var head = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?><feed xmlns:d=\"http://schemas.microsoft.com/ado/2007/08/dataservices\" xmlns:m=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\" xmlns=\"http://www.w3.org/2005/Atom\">";
                    var foot = "</feed>";
                    //var i = 0;

                    async.series([
                            function(callback){
                                fs.writeFile('odata.xml', head, function (err) {
                                    if (err) throw err;
                                    //console.log("head written");
                                    callback(null, 'one');
                                });

                            },
                            function(callback){
                                async.eachSeries(docs, function(doc, callback) {
                                    var entry = "<entry><content type=\"application/xml\"><m:properties>";
                                    for (var prop in odataModel) {
                                        if (odataModel.hasOwnProperty(prop)) {
                                            var type = (odataModel[prop]!=""      ?    "m:type=\""+odataModel[prop]+"\""    :     "");
                                            if(odataModel[prop]=="Edm.DateTime" && doc[prop]){
                                                var date = moment(doc[prop]);
                                                doc[prop] = date.toISOString();
                                                //doc[prop] = moment(doc[prop], "YYYY-MM-DD HH:mm:ss");
                                            }
                                            entry+="<d:"+prop+" "+type+" " + (!doc[prop] ? "m:null=\"true\"" : "")  + ">"+(doc[prop]?doc[prop]:"")+"</d:"+prop+">";

                                            //console.log(p);
                                            //console.log(m);
                                            //console.log(o[p]);
                                        }
                                    }
                                    entry+="</m:properties></content></entry>";
                                    //console.log(i++);

                                    fs.appendFile('odata.xml', entry, function (err) {
                                        if (err) throw err;
                                        //console.log("entry written");
                                        callback();
                                    });


                                }, function(err){
                                    callback(null, 'two');
                                });

                            },

                            function(callback){
                                fs.appendFile('odata.xml', foot, function (err) {
                                    if (err) throw err;
                                    //console.log("foot written");
                                    callback(null, 'three');
                                });

                            },
                        ],
                        function(err, results){
                            if( err ) {
                                return callback(err, 'ROUND9 ERROR');
                            }
                            callback(null, 'ROUND9 SUCCESS');
                        });










                });
            //ROUND9
            //ROUND9
            //ROUND9
        }
    ],
        // optional callback
        function (err, results) {
            // results is now equal to ['one', 'two']
            if (err) return done(errorBuilder(err));
            done({ operationResult: 0, result: results });
        });
}


