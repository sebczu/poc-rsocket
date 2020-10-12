import { RSocketClient,
  JsonSerializer,
  IdentitySerializer } from "rsocket-core";
import { ReactiveSocket, Encodable } from 'rsocket-types';
import RSocketWebSocketClient from "rsocket-websocket-client";
import { ConnectionSocket } from "./connectionSocket";
import { EventLog } from "./eventLog";

let socketFireAndForget: ReactiveSocket<any, Encodable>;

let clientId = Math.floor((Math.random() * 10000) + 1);
let keepAlive = 60000;
let lifetime = 70000;

const eventLog = new EventLog();
const connectionSocket = new ConnectionSocket();

const clientFireAndForget = new RSocketClient({
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

function connectFireAndForget() {
  eventLog.add("connection: click");

  clientFireAndForget.connect().subscribe({
    onComplete: socket => {
      socketFireAndForget = socket;
      connectionSocket.subsribe(socketFireAndForget);
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

function sendFireAndForget() {
  eventLog.add("request: click");

  socketFireAndForget.fireAndForget({
    data: 'example text',
    metadata: String.fromCharCode('fireandforget'.length) + 'fireandforget',
  });
}

function closeFireAndForget() {
  eventLog.add("close: click");
  socketFireAndForget.close();
}

document.getElementById("connectFireAndForget").addEventListener('click', (e:Event) => connectFireAndForget());
document.getElementById("sendFireAndForget").addEventListener('click', (e:Event) => sendFireAndForget());
document.getElementById("closeFireAndForget").addEventListener('click', (e:Event) => closeFireAndForget());
