var FileRepo = require("../../dataLayer/repositories/files/filesRepo");
var async = require("async");
var fs = require('fs');
var FileHelper = require("../../helpers/files/fileHelper");
var AllowedFileTypes = require("../../dataLayer/models/files/fileTypes");

var deleteFile = function(fileName, done, data){
    fs.unlink(fileName, function (err) {
        if (err) return done({operationResult: 1, result: "File processing error"});
        done(data);
    });
}

exports.add = function (file, userId, done) {

            if(!_.any(AllowedFileTypes, function(item){ return item.extension.toLowerCase() == file.extension.toLowerCase(); })){
                return deleteFile('./uploads/'+file.name, done, {opeartionResult: 2, originalName: file.originalname, result: "#wrongFileType"});
            }

            var fileType = _.find(AllowedFileTypes, function(item){return item.extension.toLowerCase() == file.extension.toLowerCase();});

            FileHelper.saveFile(file, 1, function(data){ //Type=0 для Amazon S3, Type=1 для папки dataStorage
                if(data.operationResult != 0)
                 return done(data);

            FileRepo.add({fileName: file.name, fileType: fileType, originalName: file.originalname, extension: file.extension,userId: userId, mimeType: file.mimetype, isConverted: false}, function(data){

                if(data.operationResult != 0)
                    return done(data);

                //fs.unlink('./uploads/'+file.name, function (err) {
                //    if (err) return done({operationResult: 1, result: "File processing"});
                //    done(data);
                //});
                deleteFile('./uploads/'+file.name, done, data);
            });
            });
}

exports.get = function(id, size, done){

            FileRepo.get(id, function(data){


                if(data.operationResult != 0){
                    return done(data);
                }

                if(!data.result)
                    return done({operationResult:2, result: "file not found"});

                if(size!="original" && data.result._doc.fileType.isImage)
                FileHelper.getFile(data.result._doc, size, 1, function(fileRes){
                    fileRes["mimeType"] = data.result._doc.mimeType;
                    fileRes["fileName"] = data.result._doc.fileName;
                    done(fileRes);
                })
                else if(size=="original"){
                    FileHelper.getFile(data.result._doc, '', 1, function(fileRes){
                        fileRes["mimeType"] = data.result._doc.mimeType;
                        fileRes["fileName"] = data.result._doc.fileName;
                        done(fileRes);
                    });
                } else if(size!="original" && !data.result._doc.fileType.isImage){
                        return FileHelper.getIconForDocument(data.result._doc.fileType.extension, function(fileRes){
                                    done(fileRes);
                        });
                }
            });
}



