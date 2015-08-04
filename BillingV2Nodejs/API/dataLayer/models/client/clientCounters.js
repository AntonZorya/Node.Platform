var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.definition =
    [{
        counterNumber: {type: String},
        plumbNumber: {type: String},
        currentStatus: {type: String},
        currentCounts: {type: Number},
        dateOfCurrentCounts: {type: Date},
        problem: {type: String},
        problemDescription: {type: String},
        lastCounts: {type: Number},
        dateOfLastCounts: {type: Date},
        hasProblem: {type: Boolean},
        installDate: {type: Date},
        checkDate: {type: Date},
        plumbInstallDate: {type: Date},
        markId: {type: Schema.Types.ObjectId, ref: 'CounterMark'},
        isCountsByAvg: {type: Boolean},
        countsByAvg: {type: Number}
    }];