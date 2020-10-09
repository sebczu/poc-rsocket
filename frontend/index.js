const {
  RSocketClient,
  JsonSerializer,
  IdentitySerializer
} = require('rsocket-core');
const RSocketWebSocketClient = require('rsocket-websocket-client').default;

var clientId = Math.floor((Math.random() * 10000) + 1);
var keepAlive = 60000;
var lifetime = 70000;

var clientConfig = new RSocketClient({
  serializers: {
    data: JsonSerializer,
    metadata: IdentitySerializer
  },
  setup: {
    keepAlive: keepAlive,
    lifetime: lifetime,
    dataMimeType: 'application/json',
    metadataMimeType: 'message/x.rsocket.routing.v0',
  },
  transport: new RSocketWebSocketClient({
    url: 'ws://localhost:7000/config'
  }),
});

var clientFireAndForget = new RSocketClient({
  serializers: {
    data: JsonSerializer,
    metadata: IdentitySerializer
  },
  setup: {
    payload: {
      data: "clientId-fireandforget-" + clientId,
      metadata: String.fromCharCode("client".length) + "client"
    },
    keepAlive: keepAlive,
    lifetime: lifetime,
    dataMimeType: 'application/json',
    metadataMimeType: 'message/x.rsocket.routing.v0',
  },
  transport: new RSocketWebSocketClient({
    url: 'ws://localhost:7000/fireandforget'
  }),
});

var clientRequestResponse = new RSocketClient({
  serializers: {
    data: JsonSerializer,
    metadata: IdentitySerializer
  },
  setup: {
    payload: {
      data: "clientId-requestresponse-" + clientId,
      metadata: String.fromCharCode("client".length) + "client"
    },
    keepAlive: keepAlive,
    lifetime: lifetime,
    dataMimeType: 'application/json',
    metadataMimeType: 'message/x.rsocket.routing.v0',
  },
  transport: new RSocketWebSocketClient({
    url: 'ws://localhost:7000/requestresponse'
  }),
});

var clientRequestStream = new RSocketClient({
  serializers: {
    data: JsonSerializer,
    metadata: IdentitySerializer
  },
  setup: {
    payload: {
      data: "clientId-requeststream-" + clientId,
      metadata: String.fromCharCode("client".length) + "client"
    },
    keepAlive: keepAlive,
    lifetime: lifetime,
    dataMimeType: 'application/json',
    metadataMimeType: 'message/x.rsocket.routing.v0',
  },
  transport: new RSocketWebSocketClient({
    url: 'ws://localhost:7000/requeststream'
  })
});

var socketConfig = undefined;
var socketFireAndForget = undefined;
var socketRequestResponse = undefined;
var socketRequestStream = undefined;
var subscriptionRequestStream = undefined;

function addEventLog(log) {
  var eventLog = document.getElementById("eventLog");
  var eventLogLi = document.createElement("li");
  eventLogLi.appendChild(document.createTextNode(log));
  eventLog.appendChild(eventLogLi);
}

function subscibeConnectionSocket(socket) {
  socket.connectionStatus().subscribe(connectionStatus => {
    addEventLog("connection status: status " + connectionStatus.kind);
  });

  socket.connectionStatus().subscribe({
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
}

// CONFIG
function connectConfig() {
  addEventLog("connection: click");

  clientConfig.connect().subscribe({
    onComplete: socket => {
      socketConfig = socket;
      subscibeConnectionSocket(socketConfig);
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

function sendConfig() {
  addEventLog("request: click");

  socketConfig.requestResponse({
    data: '',
    metadata: String.fromCharCode('config'.length) + 'config',
  }).subscribe({
    onComplete: payload => {
      addEventLog("request: on complete actualConnection: " + payload.data.actualConnection + ", metadata: " + payload.metadata);
    },
    onError: error => {
      addEventLog("request: error " + error);
    },
    onSubscribe: cancel => {
      addEventLog("request: on subscribe");
    },
  });
}

// FIRE-AND-FORGET
function connectFireAndForget() {
  addEventLog("connection: click");

  clientFireAndForget.connect().subscribe({
    onComplete: socket => {
      socketFireAndForget = socket;
      subscibeConnectionSocket(socketFireAndForget);
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

  socketFireAndForget.fireAndForget({
    data: 'example text',
    metadata: String.fromCharCode('fireandforget'.length) + 'fireandforget',
  });
}

function closeFireAndForget() {
  addEventLog("close: click");
  socketFireAndForget.close();
}
// REQUEST-RESPONSE
function connectRequestResponse() {
  addEventLog("connection: click");

  clientRequestResponse.connect().subscribe({
    onComplete: socket => {
      socketRequestResponse = socket;
      subscibeConnectionSocket(socketRequestResponse);
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

function closeRequestResponse() {
  addEventLog("close: click");
  socketRequestResponse.close();
}
// REQUEST-STREAM
function connectRequestStream() {
  addEventLog("connection: click");

  clientRequestStream.connect().subscribe({
    onComplete: socket => {
      socketRequestStream = socket;
      subscibeConnectionSocket(socketRequestStream);
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
      subscriptionRequestStream = subscription;
      //max number of reponse element
      subscription.request(100);
      addEventLog("request: on subscribe");
    },
  });

}

// cancel flux response, it's not close connection
function cancelRequestStream() {
  addEventLog("cancel: click");
  subscriptionRequestStream.cancel();
}

function closeRequestStream() {
  addEventLog("close: click");
  socketRequestStream.close();
}

document.getElementById("connectConfig").addEventListener('click', connectConfig);
document.getElementById("sendConfig").addEventListener('click', sendConfig);

document.getElementById("connectFireAndForget").addEventListener('click', connectFireAndForget);
document.getElementById("sendFireAndForget").addEventListener('click', sendFireAndForget);
document.getElementById("closeFireAndForget").addEventListener('click', closeFireAndForget);

document.getElementById("connectRequestResponse").addEventListener('click', connectRequestResponse);
document.getElementById("sendRequestResponse").addEventListener('click', sendRequestResponse);
document.getElementById("closeRequestResponse").addEventListener('click', closeRequestResponse);

document.getElementById("connectRequestStream").addEventListener('click', connectRequestStream);
document.getElementById("sendRequestStream").addEventListener('click', sendRequestStream);
document.getElementById("cancelRequestStream").addEventListener('click', cancelRequestStream);
document.getElementById("closeRequestStream").addEventListener('click', closeRequestStream);


