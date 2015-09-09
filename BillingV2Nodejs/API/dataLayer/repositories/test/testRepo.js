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
                .deepPopulate('kskId addressId.addressTypeId controllerId clientType.tariffId')
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
                    if (err) callback(err);
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
                        "Лицевой_счет": "$accountNumber",
                        "Номер": "$number",
                        "Наименование": "$name",
                        "БИН": "$bin",
                        "РНН": "$rnn",
                        "Адрес": "$address",
                        "Телефон": "$phone",
                        "email": "$email",
                        "Период": "$period",
                        abonentEntryDate: "$abonentEntryDate",
                        pipelines_id: "$pipelines._id",
                        pipelines_number: "$pipelines.number",
                        pipelines_description: "$pipelines.description",
                        pipelines_addressId: "$pipelines.addressId",
                        pipelines_isByCounter: "$pipelines.isByCounter",
                        pipelines_waterPercent: "$pipelines.waterPercent",
                        pipelines_canalPercent: "$pipelines.canalPercent",
                        pipelines_isActive: "$pipelines.isActive",
                        pipelines_fileIds: "$pipelines.fileIds",
                        pipelines_avg: "$pipelines.avg",
                        pipelines_norm: "$pipelines.norm",
                        pipelines_counters_counterNumber: "$pipelines.counters.counterNumber",
                        pipelines_counters_currentStatus: "$pipelines.counters.currentStatus",
                        pipelines_counters_currentCounts: "$pipelines.counters.currentCounts",
                        pipelines_counters_dateOfCurrentCounts: "$pipelines.counters.dateOfCurrentCounts",
                        pipelines_counters_problem: "$pipelines.counters.problem",
                        pipelines_counters_problemDescription: "$pipelines.counters.problemDescription",
                        pipelines_counters_lastCounts: "$pipelines.counters.lastCounts",
                        pipelines_counters_dateOfLastCounts: "$pipelines.counters.dateOfLastCounts",
                        pipelines_counters_hasProblem: "$pipelines.counters.hasProblem",
                        pipelines_counters_installDate: "$pipelines.counters.installDate",
                        pipelines_counters_checkDate: "$pipelines.counters.checkDate",
                        pipelines_counters_plumbNumber: "$pipelines.counters.plumbNumber",
                        pipelines_counters_plumbInstallDate: "$pipelines.counters.plumbInstallDate",
                        pipelines_counters_markId: "$pipelines.counters.markId",
                        pipelines_counters_fileIds: "$pipelines.counters.fileIds",
                        pipelines_counters_isActive: "$pipelines.counters.isActive",
                        pipelines_counters_removeDate: "$pipelines.counters.removeDate",
                        controllerId_fullName: "$controllerId.fullName",
                        controllerId_code: "$controllerId.code",
                        clientType_name: "$clientType.name",
                        clientType_minConsumption: "$clientType.minConsumption",
                        clientType_avgConsumption: "$clientType.avgConsumption",
                        clientType_maxConsumption: "$clientType.maxConsumption",
                        clientType_parentId: "$clientType.parentId",
                        clientType_tariffId_name: "$clientType.tariffId.name",
                        clientType_tariffId_water: "$clientType.tariffId.water",
                        clientType_tariffId_canal: "$clientType.tariffId.canal",
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
                    doc.newClient = client._doc;
                    
                    var model = CalculationPopulated(doc);
    
                    model.save(function (err) {
                        if (err) callback(err);
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


