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

        isCountsByAvg: {type: Boolean},
        countsByAvg: {type: Number},

        installDate: {type: Date},
        checkDate: {type: Date},
        plumbNumber: {type: String},
        plumbInstallDate: {type: Date},
        markId: {type: Schema.Types.ObjectId, ref: 'CounterMark'},
        fileIds: [], //акт снятия, акт установки

        isActive: {type: Boolean}

    }];