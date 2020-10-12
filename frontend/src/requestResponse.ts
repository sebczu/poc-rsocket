import { RSocketClient,
  JsonSerializer,
  IdentitySerializer } from "rsocket-core";
import { ReactiveSocket, Encodable } from 'rsocket-types';
import RSocketWebSocketClient from "rsocket-websocket-client";
import { ConnectionSocket } from "./connectionSocket";
import { EventLog } from "./eventLog";

let socketRequestResponse: ReactiveSocket<any, Encodable>;

let clientId = Math.floor((Math.random() * 10000) + 1);
let keepAlive = 60000;
let lifetime = 70000;

const eventLog = new EventLog();
const connectionSocket = new ConnectionSocket();

const clientRequestResponse = new RSocketClient({
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
  })
});

function connectRequestResponse() {
  eventLog.add("connection: click");

  clientRequestResponse.connect().subscribe({
    onComplete: socket => {
      socketRequestResponse = socket;
      connectionSocket.subsribe(socketRequestResponse);
      eventLog.add("connection: on complete");
    },
    onError: error => {
      eventLog.add("connection: error " + error);
    },
    onSubscribe: cancel => {
      eventLog.add("connection: on subscribe");
    }
  });
}

function sendRequestResponse() {
  eventLog.add("request: click");

  socketRequestResponse.requestResponse({
    data: 'example text',
    metadata: String.fromCharCode('requestresponse'.length) + 'requestresponse',
  }).subscribe({
    onComplete: payload => {
      eventLog.add("request: on complete data: " + payload.data.character + ", metadata: " + payload.metadata);
    },
    onError: error => {
      eventLog.add("request: error " + error);
    },
    onSubscribe: cancel => {
      eventLog.add("request: on subscribe");
    },
  });
}

function closeRequestResponse() {
  eventLog.add("close: click");
  socketRequestResponse.close();
}

document.getElementById("connectRequestResponse").addEventListener('click', (e:Event) => connectRequestResponse());
document.getElementById("sendRequestResponse").addEventListener('click', (e:Event) => sendRequestResponse());
document.getElementById("closeRequestResponse").addEventListener('click', (e:Event) => closeRequestResponse());
