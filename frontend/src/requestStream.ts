import { RSocketClient,
  JsonSerializer,
  IdentitySerializer } from "rsocket-core";
import { ReactiveSocket, Encodable, ISubscription } from 'rsocket-types';
import RSocketWebSocketClient from "rsocket-websocket-client";
import { ConnectionSocket } from "./connectionSocket";
import { EventLog } from "./eventLog";

let socketRequestStream: ReactiveSocket<any, Encodable>;
let subscriptionRequestStream: ISubscription;

let clientId = Math.floor((Math.random() * 10000) + 1);
let keepAlive = 60000;
let lifetime = 70000;

const eventLog = new EventLog();
const connectionSocket = new ConnectionSocket();

const clientRequestStream = new RSocketClient({
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

function connectRequestStream() {
  eventLog.add("connection: click");

  clientRequestStream.connect().subscribe({
    onComplete: socket => {
      socketRequestStream = socket;
      connectionSocket.subsribe(socketRequestStream);
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

function sendRequestStream() {
  eventLog.add("request: click");

  socketRequestStream.requestStream({
    data: 'text',
    metadata: String.fromCharCode('requeststream'.length) + 'requeststream'
  }).subscribe({
    onComplete: () => {
      eventLog.add("request: on complete");
    },
    onError: error => {
      eventLog.add("request: error " + error);
    },
    onNext: payload => {
      eventLog.add("request: on next data: " + payload.data.character + ", metadata: " + payload.metadata);
    },
    onSubscribe: subscription => {
      subscriptionRequestStream = subscription;
      //max number of reponse element
      subscription.request(100);
      eventLog.add("request: on subscribe");
    },
  });
}

// cancel flux response, it's not close connection
function cancelRequestStream() {
  eventLog.add("cancel: click");
  subscriptionRequestStream.cancel();
}

function closeRequestStream() {
  eventLog.add("close: click");
  socketRequestStream.close();
}

document.getElementById("connectRequestStream").addEventListener('click', (e:Event) => connectRequestStream());
document.getElementById("sendRequestStream").addEventListener('click', (e:Event) => sendRequestStream());
document.getElementById("cancelRequestStream").addEventListener('click', (e:Event) => cancelRequestStream());
document.getElementById("closeRequestStream").addEventListener('click', (e:Event) => closeRequestStream());
