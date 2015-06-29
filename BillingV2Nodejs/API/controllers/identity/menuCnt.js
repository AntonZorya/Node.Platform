var MenuLogic = require("../../logicLayer/identity/menuLogic");

module.exports = function (router) {
    router.route("/identity/menu")
    .get(function (req, res) {
        MenuLogic.getMenuItems(req.user, function (data) {
            res.json(data);
        });
    });


}