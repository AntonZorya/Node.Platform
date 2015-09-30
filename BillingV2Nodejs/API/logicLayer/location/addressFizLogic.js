var repo = require('../../dataLayer/repositories/location/addressFizRepo');

exports.getById = function (id, done) {
    repo.getById(id, function (data) {
        done(data);
    })
};

exports.getAll = function (done) {
    repo.getAll(function (data) {
        done(data);
    });
};

exports.getChildrenByParentId = function (parentId, done){
    repo.getChildrenByParentId(parentId, done);
};

exports.getByAddressTypeId = function (typeId, done){
    repo.getChildrenByParentId(typeId, done);
};