var clientFactory = require("devir-mbclient");
module.exports = function(onConnection, host, port) {
    return new clientFactory.core(clientFactory.netConnector, host?host:config.mb.host, port?port:config.mb.port, onConnection);
}