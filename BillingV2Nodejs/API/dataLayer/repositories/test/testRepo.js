var ClientJurDef = require('../../models/client/clientJur');
var ClientCollection = new require('../../../helpers/mongoose/modelBuilder')('ClientJur', ClientJurDef);
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
var async = require('async');
var Schema = mongoose.Schema;
var MixedSchema = new Schema({ any: Schema.Types.Mixed }, { strict: false });
var ClientJoined = mongoose.model('_ClientJoined', MixedSchema);


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
                                    "Лицевой_счет": "$accountNumber",
                                    "Номер": "$number",
                                    "Наименование": "$name",
                                    "БИН": "$bin",
                                    "РНН": "$rnn",
                                    "Адрес": "$address",
                                    "Этаж": "$floor",
                                    "Всего_этажей": "$floorsTotal",
                                    "Квартира": "$ap",
                                    "Площадь": "$area",
                                    "Телефон": "$phone",
                                    "email": "$email",
                                    "Период": "$period",
                                    "Наличие_счетчиков": "$isCounter",
                                    "Процент_воды": "$waterPercent",
                                    "Процент_канализации": "$canalPercent",
                                    "abonentEntryDate": 1,
                                    //counters: clientCounters,
                                    "Номер_счетчика": "$counters.counterNumber",
                                    "Номер_пломбы": "$counters.plumbNumber",
                                    "Статус_счетчика": "$counters.currentStatus",
                                    "Текущие_показания": "$counters.currentCounts",
                                    "Дата_текущего_показания": "$counters.dateOfCurrentCounts",
                                    "Проблема_счетчика": "$counters.problem",
                                    "Описание_проблемы_счетчика": "$counters.problemDescription",
                                    "Предыдущие_показания": "$counters.lastCounts",
                                    "Дата_предыдущего_показания": "$counters.dateOfLastCounts",
                                    "Наличие_проблем_со_счетчиком": "$counters.hasProblem",
                                    "Дата_установки_счетчика": "$counters.installDate",
                                    "Дата_поверки_счетчика": "$counters.checkDate",
                                    "Дата_опломбирования_счетчика": "$counters.plumbInstallDate",
                                    "counters_markId": "$counters.markId",//{type: Schema.Types.ObjectId, ref: 'CounterMark'},
                                    "Расчет_по_среднему": "$counters.isCountsByAvg",
                                    "Показания_по_среднему": "$counters.countsByAvg",
                                    //controllerId: 1,
                                    "Имя_контролера": "$controllerId.fullName",
                                    "Код_контролера": "$controllerId.code",
                                    //clientTypeId: 1,
                                    "Тип_потребителя": "$clientTypeId.name",
                                    "Тариф_потребителя": "$clientTypeId.tariffId.name",
                                    "Тариф_воды": "$clientTypeId.tariffId.water",
                                    "Тариф_канализации": "$clientTypeId.tariffId.canal",
                                    "Дата_начала_действия_тарифа": "$clientTypeId.tariffId.date",
                                    "kskId": 1,//{type: Schema.Types.ObjectId, ref: 'ksk'},
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



