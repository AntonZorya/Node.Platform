var addressLogic = require('../../logicLayer/location/addressLogic');

module.exports = function (router) {

    router.route('/location/streets').
        get(function (req, res) {
            addressLogic.getByParentId(req.parentId, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/location/getByTypeId').
        get(function (req, res) {
            addressLogic.getByAddressTypeId(req.typeId, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/location/getByParentId').
        get(function (req, res) {
            addressLogic.getChildrenByParentId(req.query.parentId, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/locationFiz/streets').
        get(function (req, res) {
            addressLogic.getByParentId(req.parentId, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/locationFiz/getByTypeId').
        get(function (req, res) {
            addressLogic.getByAddressTypeId(req.typeId, function (data) {
                operationResultBuilder(data, res);
            });
        });

    router.route('/locationFiz/getByParentId').
        get(function (req, res) {
            addressLogic.getChildrenByParentId(req.query.parentId, function (data) {
                operationResultBuilder(data, res);
            });
        });

};