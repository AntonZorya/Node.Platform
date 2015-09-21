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


var ClientPopulated = mongoose.model('_ClientPopulated', MixedSchema);
var CalculationPopulated = mongoose.model('_CalculationPopulated', MixedSchema);
var ClientPopulatedAndAggregated = mongoose.model('_ClientPopulatedAndAggregated', MixedSchema, '_ClientPopulatedAndAggregated');



exports.unwindData = function (done) {
    var round1Result;
    var round5Result;

    async.series([
        function (callback) {
            //ROUND1
            //ROUND1
            //ROUND1
            ClientCollection
                .find()
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
                        pipelines_addressId: "$pipelines.addressId",
                        pipelines_isByCounter: "$pipelines.isByCounter",
                        "Процент_воды_ввода": "$pipelines.waterPercent",
                        "Процент_канализации_ввода": "$pipelines.canalPercent",
                        "Ввод_в_действии": "$pipelines.isActive",
                        pipelines_fileIds: "$pipelines.fileIds",
                        pipelines_avg: "$pipelines.avg",
                        pipelines_norm: "$pipelines.norm",
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
                .find()
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
            mongoose.connection.db.dropCollection('_calculationpopulateds', function (err, result) {
                if (err) {
                    return callback(null, 'ROUND6 ERROR');
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
            async.eachSeries(round5Result, function (doc, callback) {
                var props = {};
                if(doc.clientJurId) props.clientJurId = doc.clientJurId;
                if(doc.pipelineId) props.pipelines_id = doc.pipelineId;
                
                ClientPopulatedAndAggregated.findOne({ clientJurId: doc.clientJurId, pipelines_id: doc.pipelineId  }, function (err, client) {
                    if(err) return callback();
                    if(client==null) return callback();
                    doc.newClient = client._doc;
                    
                    var model = CalculationPopulated(doc);
    
                    model.save(function (err) {
                        if (err) return callback(err);
                        callback();
                    });
                });
            }, function (err) {
                if (err) {
                    return callback(err, 'ROUND7 ERROR');
                }
                callback(null, 'ROUND7 SUCCESS');
            });
            //ROUND7
            //ROUND7
            //ROUND7
        },
    ],
        // optional callback
        function (err, results) {
            // results is now equal to ['one', 'two']
            if (err) return done(errorBuilder(err));
            done({ operationResult: 0, result: results });
        });
}


