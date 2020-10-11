import { RSocketClient,
  JsonSerializer,
  IdentitySerializer } from "rsocket-core";
import { ReactiveSocket, Encodable } from 'rsocket-types';
// import { Flowable } from "rsocket-flowable";
import RSocketWebSocketClient from "rsocket-websocket-client";

let socketConfig: ReactiveSocket<any, Encodable>;

let clientId = Math.floor((Math.random() * 10000) + 1);
let keepAlive = 60000;
let lifetime = 70000;

const clientConfig = new RSocketClient({
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

function addEventLog(log: string) {
  var eventLog = document.getElementById("eventLog");
  var eventLogLi = document.createElement("li");
  eventLogLi.appendChild(document.createTextNode(log));
  eventLog.appendChild(eventLogLi);
}

function subscibeConnectionSocket(socket: ReactiveSocket<any, Encodable>) {
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

function connectConfig() {
  addEventLog("connection: click");

  clientConfig.connect().subscribe({
    onComplete: socket => {
      addEventLog("connection: on complete");
      subscibeConnectionSocket(socket);
      socketConfig = socket;
    },
    onError: error => {
      addEventLog("connection: error " + error);
    },
    onSubscribe: cancel => {
      addEventLog("connection: on subscribe");
    }
  });
}

document.getElementById("connectConfig").addEventListener('click', (e:Event) => connectConfig());
// document.getElementById("sendConfig").addEventListener('click', sendConfig);

// function greeter(person: string) {
//   return "Hello, " + person;
// }

// let user = "Jane User";

// document.body.textContent = greeter(user);