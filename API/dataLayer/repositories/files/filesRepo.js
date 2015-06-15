var FileDef = new require("../../models/files/fileModel");
var Collection = new require('../../../helpers/mongoose/modelBuilder')('File', FileDef);



exports.add = function (file, done) {
    var model = Collection(file);
    model.save(function (err) {
        if (err) return done(errorBuilder(err));
        return done({ operationResult: 0, result: model });
    });
}

exports.update = function (file, done) {
    if (file._id) {
        Collection.findOneAndUpdate({ _id: file._id }, file, function (err) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0, result: file});
        });
    }
    else {
        return done({ operationResult: 1, result: "#filenotfound" });
    }
}
