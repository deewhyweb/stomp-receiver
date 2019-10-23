"use strict";

var rhea = require("rhea");
var url = require("url");
var fs = require('fs')
var path = require('path')

if (process.argv.length !== 4 && process.argv.length !== 5) {
    console.error("Usage: receive.js CONNECTION-URL ADDRESS [MESSAGE-COUNT]");
    process.exit(1);
}

var conn_url = url.parse(process.argv[2]);
var address = process.argv[3];
var desired = 0;
var received = 0;

if (process.argv.length === 5) {
    desired = parseInt(process.argv[4]);
}

var container = rhea.create_container();

container.on("receiver_open", function (event) {
    console.log("RECEIVE: Opened receiver for source address '" +
                event.receiver.source.address + "'");
});

container.on("message", function (event) {
    var message = event.message;

    console.log("RECEIVE: Received message '" + message.body + "'");

    received++;

    if (received == desired) {
        event.receiver.close();
        event.connection.close();
    }
});

var opts = {
    username: 'user-4be15c75-f59b-11e9-b321-0a580a820043',
    password: 'qm4_rLukX7dLFRPINWxctm2Ve5THfKGM',
    host: conn_url.hostname,
    port: conn_url.port || 443,
    transport:'tls',
    ca: [ fs.readFileSync(path.resolve(__dirname,'root.pem')) ]
};
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
var conn = container.connect(opts);
conn.open_receiver(address);