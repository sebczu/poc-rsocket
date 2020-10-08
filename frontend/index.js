const {
  RSocketClient,
  JsonSerializer,
  IdentitySerializer
} = require('rsocket-core');
const RSocketWebSocketClient = require('rsocket-websocket-client').default;
var client = undefined;

var clientFireAndForget = undefined;
var socketFireAndForget = undefined;

var clientRequestResponse = undefined;
var socketRequestResponse = undefined;

var clientRequestStream = undefined;
var socketRequestStream = undefined;

function addEventLog(log) {
  var eventLog = document.getElementById("eventLog");
  var eventLogLi = document.createElement("li");
  eventLogLi.appendChild(document.createTextNode(log));
  eventLog.appendChild(eventLogLi);
}

// FIRE-AND-FORGET
function connectFireAndForget() {
  addEventLog("connection: click");

  clientFireAndForget = new RSocketClient({
    serializers: {
      data: JsonSerializer,
      metadata: IdentitySerializer
    },
    setup: {
      keepAlive: 5000,
      lifetime: 10000,
      dataMimeType: 'application/json',
      metadataMimeType: 'message/x.rsocket.routing.v0',
    },
    transport: new RSocketWebSocketClient({
      url: 'ws://localhost:7000/fireandforget'
    }),
  });

  clientFireAndForget.connect().subscribe({
    onComplete: socket => {
      socketFireAndForget = socket;
      addEventLog("connection: on complete");
    },
    onError: error => {
      addEventLog("connection: error " + error);
    },
    onSubscribe: cancel => {
      addEventLog("connection: on subscribe");
    }
  });
}

function sendFireAndForget() {
  addEventLog("request: click");

  socketFireAndForget.connectionStatus().subscribe(connectionStatus => {
    addEventLog("connection status: status " + connectionStatus.kind);
  });

  socketFireAndForget.connectionStatus().subscribe({
    onComplete: () => {
      addEventLog("connection status: on complete");
    },
    onError: error => {
      addEventLog("connection status: error " + error);
    },
    onNext: value => {
      addEventLog("connection status: on next " + value);
    },
    onSubscribe: subscription => {
      addEventLog("connection status: on subscribe, name:" + subscription.request.name + ", length: " + subscription.request.length + ", prototype: " +  subscription.request.prototype);
    }
  });

  socketFireAndForget.fireAndForget({
    data: 'example text',
    metadata: String.fromCharCode('fireandforget'.length) + 'fireandforget',
  });
}
// REQUEST-RESPONSE
function connectRequestResponse() {
  addEventLog("connection: click");

  clientRequestResponse = new RSocketClient({
    serializers: {
      data: JsonSerializer,
      metadata: IdentitySerializer
    },
    setup: {
      keepAlive: 5000,
      lifetime: 10000,
      dataMimeType: 'application/json',
      metadataMimeType: 'message/x.rsocket.routing.v0',
    },
    transport: new RSocketWebSocketClient({
      url: 'ws://localhost:7000/requestresponse'
    }),
  });

  clientRequestResponse.connect().subscribe({
    onComplete: socket => {
      socketRequestResponse = socket;
      addEventLog("connection: on complete");
    },
    onError: error => {
      addEventLog("connection: error " + error);
    },
    onSubscribe: cancel => {
      addEventLog("connection: on subscribe");
    }
  });
}

function sendRequestResponse() {
  addEventLog("request: click");

  socketRequestResponse.connectionStatus().subscribe(connectionStatus => {
    addEventLog("connection status: status " + connectionStatus.kind);
  });

  socketRequestResponse.connectionStatus().subscribe({
    onComplete: () => {
      addEventLog("connection status: on complete");
    },
    onError: error => {
      addEventLog("connection status: error " + error);
    },
    onNext: value => {
      addEventLog("connection status: on next " + value);
    },
    onSubscribe: subscription => {
      addEventLog("connection status: on subscribe, name:" + subscription.request.name + ", length: " + subscription.request.length + ", prototype: " +  subscription.request.prototype);
    }
  });

  socketRequestResponse.requestResponse({
    data: 'example text',
    metadata: String.fromCharCode('requestresponse'.length) + 'requestresponse',
  }).subscribe({
    onComplete: payload => {
      addEventLog("request: on complete data: " + payload.data.character + ", metadata: " + payload.metadata);
    },
    onError: error => {
      addEventLog("request: error " + error);
    },
    onSubscribe: cancel => {
      addEventLog("request: on subscribe");
    },
  });
}
// REQUEST-STREAM
function connectRequestStream() {
  addEventLog("connection: click");

  clientRequestStream = new RSocketClient({
    serializers: {
      data: JsonSerializer,
      metadata: IdentitySerializer
    },
    setup: {
      keepAlive: 5000,
      lifetime: 10000,
      dataMimeType: 'application/json',
      metadataMimeType: 'message/x.rsocket.routing.v0',
    },
    transport: new RSocketWebSocketClient({
      url: 'ws://localhost:7000/requeststream'
    }),
  });

  clientRequestStream.connect().subscribe({
    onComplete: socket => {
      // socket.requestStream
      socketRequestStream = socket;
      addEventLog("connection: on complete");
    },
    onError: error => {
      addEventLog("connection: error " + error);
    },
    onSubscribe: cancel => {
      addEventLog("connection: on subscribe");
    }
  });
}

function sendRequestStream() {
  addEventLog("request: click");

  socketRequestStream.connectionStatus().subscribe(connectionStatus => {
    addEventLog("connection status: status " + connectionStatus.kind);
  });

  socketRequestStream.connectionStatus().subscribe({
    onComplete: () => {
      addEventLog("connection status: on complete");
    },
    onError: error => {
      addEventLog("connection status: error " + error);
    },
    onNext: value => {
      addEventLog("connection status: on next " + value);
    },
    onSubscribe: subscription => {
      addEventLog("connection status: on subscribe, name:" + subscription.request.name + ", length: " + subscription.request.length + ", prototype: " +  subscription.request.prototype);
    }
  });

  socketRequestStream.requestStream({
    data: 'text',
    metadata: String.fromCharCode('requeststream'.length) + 'requeststream',
  }).subscribe({
    onComplete: () => {
      addEventLog("request: on complete");
    },
    onError: error => {
      addEventLog("request: error " + error);
    },
    onNext: payload => {
      addEventLog("request: on next data: " + payload.data.character + ", metadata: " + payload.metadata);
    },
    onSubscribe: subscription => {
      subscription.request(100);
      addEventLog("request: on subscribe");
    },
  });

}

document.getElementById("connectFireAndForget").addEventListener('click', connectFireAndForget);
document.getElementById("sendFireAndForget").addEventListener('click', sendFireAndForget);
document.getElementById("connectRequestResponse").addEventListener('click', connectRequestResponse);
document.getElementById("sendRequestResponse").addEventListener('click', sendRequestResponse);
document.getElementById("connectRequestStream").addEventListener('click', connectRequestStream);
document.getElementById("sendRequestStream").addEventListener('click', sendRequestStream);