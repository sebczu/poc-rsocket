"use strict";
exports.__esModule = true;
var rsocket_core_1 = require("rsocket-core");
// import { Flowable } from "rsocket-flowable";
var rsocket_websocket_client_1 = require("rsocket-websocket-client");
var socketConfig;
var clientId = Math.floor((Math.random() * 10000) + 1);
var keepAlive = 60000;
var lifetime = 70000;
var clientConfig = new rsocket_core_1.RSocketClient({
    serializers: {
        data: rsocket_core_1.JsonSerializer,
        metadata: rsocket_core_1.IdentitySerializer
    },
    setup: {
        keepAlive: keepAlive,
        lifetime: lifetime,
        dataMimeType: 'application/json',
        metadataMimeType: 'message/x.rsocket.routing.v0'
    },
    transport: new rsocket_websocket_client_1["default"]({
        url: 'ws://localhost:7000/config'
    })
});
function addEventLog(log) {
    var eventLog = document.getElementById("eventLog");
    var eventLogLi = document.createElement("li");
    eventLogLi.appendChild(document.createTextNode(log));
    eventLog.appendChild(eventLogLi);
}
function subscibeConnectionSocket(socket) {
    socket.connectionStatus().subscribe(function (connectionStatus) {
        addEventLog("connection status: status " + connectionStatus.kind);
    });
    socket.connectionStatus().subscribe({
        onComplete: function () {
            addEventLog("connection status: on complete");
        },
        onError: function (error) {
            addEventLog("connection status: error " + error);
        },
        onNext: function (value) {
            addEventLog("connection status: on next " + value);
        },
        onSubscribe: function (subscription) {
            addEventLog("connection status: on subscribe, name:" + subscription.request.name + ", length: " + subscription.request.length + ", prototype: " + subscription.request.prototype);
        }
    });
}
function connectConfig() {
    addEventLog("connection: click");
    clientConfig.connect().subscribe({
        onComplete: function (socket) {
            addEventLog("connection: on complete");
            subscibeConnectionSocket(socket);
            socketConfig = socket;
        },
        onError: function (error) {
            addEventLog("connection: error " + error);
        },
        onSubscribe: function (cancel) {
            addEventLog("connection: on subscribe");
        }
    });
}
document.getElementById("connectConfig").addEventListener('click', function (e) { return connectConfig(); });
// document.getElementById("sendConfig").addEventListener('click', sendConfig);
// function greeter(person: string) {
//   return "Hello, " + person;
// }
// let user = "Jane User";
// document.body.textContent = greeter(user);
