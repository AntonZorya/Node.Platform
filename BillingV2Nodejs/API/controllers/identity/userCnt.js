var UserLogic = require(_logicPath + 'identity/userLogic');

module.exports = function (router) {
    router.route("/identity/user")
    .post(function (req, res) {
        UserLogic.add(req.body, req.user.organizationId, function (data) {
            operationResultBuilder(data,  res);
        });
    });
    
    router.route("/identity/user/update")
    .post(function (req, res) {
        UserLogic.update(req.body, function (data) {
            res.json(data);
        });
    });

    router.route("/identity/user")
    .delete(function (req, res) {
        UserLogic.delete(req.params.id, function (data) {
            res.json(data);
        });
    });

    router.route("/identity/user/changepassword")
    .post(function (req, res) {
        UserLogic.changePassword(req.body, function (data) {
            res.json(data);
        });
    });

    router.route("/identity/users")
    .get(function (req, res) {
        UserLogic.getUsersByOrganiztionId(req.query.organizationId, function (data) {
            operationResultBuilder(data, res);
        });
    });

    router.route("/identity/user")
    .get(function (req, res) {
        UserLogic.getById(req.query.id, function (data) {
            operationResultBuilder(data, res);
        });
    });
}