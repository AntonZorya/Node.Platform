var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.definition =
    [{
        counterNumber: {type: String},
        currentStatus: {type: String},
        currentCounts: {type: Number},
        dateOfCurrentCounts: {type: Date},
        problem: {type: String},
        problemDescription: {type: String},
        lastCounts: {type: Number},
        dateOfLastCounts: {type: Date},
        hasProblem: {type: Boolean},
        installDate: {type: Date},
        checkDate: {type: Date},//дата след. проверки
        plumbNumber: {type: String},
        plumbInstallDate: {type: Date},
        markId: {type: Schema.Types.ObjectId, ref: 'CounterMark'},//марка счетчика
        fileIds: [], //акт снятия, акт установки
        isActive: {type: Boolean},
        isCounterNew: {type: Boolean} //TODO: При закрытии периода делать false (новый добавленный счетчик в данном периоде)
    }];