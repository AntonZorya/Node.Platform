var menuDefinitions = require("../../dataLayer/security/menuDefinitions");

exports.getMenuItems = function (user, done) {
    var roles = user.roles;
    var menu = [];
    _.each(menuDefinitions, function (item) {
        var menuItem = getMenuItem(item, roles);
        if (menuItem != null)
            menu.push(menuItem);
    });
    return done(menu);
}


function getMenuItem(menuItem, roles)
{
    if (menuItem.roles == null || checkMenuItem(menuItem, roles))
    {
        var childs = menuItem.childs;
        menuItem.childs = [];
        _.each(childs, function (child) {
            var ret = getMenuItem(child, roles);
            if (ret != null)
                menuItem.childs.push(child);
        });
        return menuItem;
    }
    return null;
}

function checkMenuItem(item, roles)
{
    if (item.roles == null)
        return true;
    var contains = false;
    _.each(item.roles, function (itemRole) {
        _.each(roles, function (role) {
            if (itemRole.sysName === role) {
                contains = true;
                return;
            }
        });
    });
    return contains;
}