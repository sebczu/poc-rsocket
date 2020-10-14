import { RSocketClient,
  JsonSerializer,
  IdentitySerializer } from "rsocket-core";
import { ReactiveSocket, Encodable } from 'rsocket-types';
import RSocketWebSocketClient from "rsocket-websocket-client";
import { ConnectionSocket } from "./connectionSocket";
import { EventLog } from "./eventLog";
import { keepAlive, lifetime, host, port } from "./const";

let socketRequestResponse: ReactiveSocket<any, Encodable>;

let clientId = Math.floor((Math.random() * 10000) + 1);

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
    url: 'ws://' + host + ':' + port + '/requestresponseexception'
  })
});

function connectRequestResponseException() {
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

function sendRequestResponseException() {
  eventLog.add("request: click");

  socketRequestResponse.requestResponse({
    data: 'example text',
    metadata: String.fromCharCode('requestresponseexception'.length) + 'requestresponseexception',
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

function closeRequestResponseException() {
  eventLog.add("close: click");
  socketRequestResponse.close();
}

document.getElementById("connectRequestResponseException").addEventListener('click', (e:Event) => connectRequestResponseException());
document.getElementById("sendRequestResponseException").addEventListener('click', (e:Event) => sendRequestResponseException());
document.getElementById("closeRequestResponseException").addEventListener('click', (e:Event) => closeRequestResponseException());
