var ClientJurDef = require('../../models/client/clientJur');
var ClientCollection = new require('../../../helpers/mongoose/modelBuilder')('ClientJur', ClientJurDef);
var ClientTypeDef = require('../../models/client/clientType');
var ClientTypesCollection = new require('../../../helpers/mongoose/modelBuilder')('ClientType', ClientTypeDef);

var mongoose = require('mongoose');
var CollectionSchema = new require('../../../helpers/mongoose/modelBuilder')('ClientJur', ClientJurDef, true);
var deepPopulate = require('mongoose-deep-populate')(mongoose);
CollectionSchema.plugin(deepPopulate, {
    whitelist: [
        'clientTypeId.tariffId',
        'addressId',
        'controllerId'
    ]
});
var mongodb = require('mongodb');
var Db = mongodb.Db;
var Server = mongodb.Server;
var async = require('async');


exports.testDP = function (done) {
    ClientCollection
        .find()
        .lean()
        .deepPopulate('clientTypeId.tariffId addressId controllerId')
        .exec(function (err, docs) {
            if (err) {
                console.log("POPULATE ERROR!!!");
                return done(errorBuilder(err));
            }
            console.log("POPULATE DONE!!!");
            console.log("DROP COLLECTION BEGIN!!!");
            mongoose.connection.db.dropCollection('_clientjoineds', function (err, result) {
                if (err) {
                    console.log("DROP COLLECTION ERROR!!!");
                }
                console.log("DROP COLLECTION SUCCESS!!!");
                var Schema = mongoose.Schema;
                var MixedSchema = new Schema({ any: Schema.Types.Mixed }, { strict: false });
                var ClientJoined = mongoose.model('_ClientJoined', MixedSchema);
                console.log("DEEP SAVE BEGIN!!!");
                async.eachSeries(docs, function (doc, callback) {
                    var model = ClientJoined(doc);
                    //console.log("saving model!!!!");
                    model.save(function (err) {
                        if (err) callback(err);
                        callback();
                    });
                }, function (err) {
                    if (err) {
                        console.log("DEEP SAVE ERROR!!!");
                        return done(errorBuilder(err));
                    }
                    else {
                        console.log("DEEP SAVE SUCCESS!!!");
                        console.log("AGGREGATE BEGIN!!!");
                        ClientJoined.aggregate(
                            { $unwind: "$counters" },
                            {
                                $project: {
                                    _id: 0,
                                    accountNumber: 1,
                                    number: 1,
                                    name: 1,
                                    bin: 1,
                                    rnn: 1,
                                    address: 1,
                                    floor: 1,
                                    floorsTotal: 1,
                                    ap: 1,
                                    area: 1,
                                    phone: 1,
                                    email: 1,
                                    period: 1,
                                    isCounter: 1,
                                    waterPercent: 1,
                                    canalPercent: 1,
                                    abonentEntryDate: 1,
                                    //counters: clientCounters,
                                    counters_counterNumber: "$counters.counterNumber",
                                    counters_plumbNumber: "$counters.plumbNumber",
                                    counters_currentStatus: "$counters.currentStatus",
                                    counters_currentCounts: "$counters.currentCounts",
                                    counters_dateOfCurrentCounts: "$counters.dateOfCurrentCounts",
                                    counters_problem: "$counters.problem",
                                    counters_problemDescription: "$counters.problemDescription",
                                    counters_lastCounts: "$counters.lastCounts",
                                    counters_dateOfLastCounts: "$counters.dateOfLastCounts",
                                    counters_hasProblem: "$counters.hasProblem",
                                    counters_installDate: "$counters.installDate",
                                    counters_checkDate: "$counters.checkDate",
                                    counters_plumbInstallDate: "$counters.plumbInstallDate",
                                    counters_markId: "$counters.markId",//{type: Schema.Types.ObjectId, ref: 'CounterMark'},
                                    counters_isCountsByAvg: "$counters.isCountsByAvg",
                                    counters_countsByAvg: "$counters.countsByAvg",
                                    //controllerId: 1,
                                    controller_fullName: "$controllerId.fullName",
                                    controller_code: "$controllerId.code",
                                    //clientTypeId: 1,
                                    clienttype_name: "$clientTypeId.name",
                                    clienttype_tariff_name: "$clientTypeId.tariffId.name",
                                    clienttype_tariff_water: "$clientTypeId.tariffId.water",
                                    clienttype_tariff_canal: "$clientTypeId.tariffId.canal",
                                    clienttype_tariff_date: "$clientTypeId.tariffId.date",
                                    kskId: 1,//{type: Schema.Types.ObjectId, ref: 'ksk'},
                                    //addressId: 1,
                                }
                            },
                            { $out: "_ClientJoinedAndAggregated" },


                            function (err, result) {
                                if (err) {
                                    console.log("AGGREGATE ERROR!!!");
                                    return done(errorBuilder(err));
                                }
                                console.log("AGGREGATE SUCCESS!!!");
                                return done({ operationResult: 0, result: result });
                            });
                    }
                });
            });
        });
}



