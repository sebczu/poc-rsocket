import { RSocketClient,
  JsonSerializer,
  IdentitySerializer } from "rsocket-core";
import { ReactiveSocket, Encodable } from 'rsocket-types';
import RSocketWebSocketClient from "rsocket-websocket-client";
import { ConnectionSocket } from "./connectionSocket";
import { EventLog } from "./eventLog";
import { ConfigResponder } from "./configResponder";
import { keepAlive, lifetime, host, port } from "./const";

let socketConfig: ReactiveSocket<any, Encodable>;

let clientId = Math.floor((Math.random() * 10000) + 1);

const eventLog = new EventLog();
const connectionSocket = new ConnectionSocket();
const configResponder = new ConfigResponder();

const clientConfig = new RSocketClient({
  serializers: {
    data: JsonSerializer,
    metadata: IdentitySerializer
  },
  setup: {
    payload: {
      data: "clientId-config-" + clientId,
      metadata: String.fromCharCode("client".length) + "client"
    },
    keepAlive: keepAlive,
    lifetime: lifetime,
    dataMimeType: 'application/json',
    metadataMimeType: 'message/x.rsocket.routing.v0',
  },
  transport: new RSocketWebSocketClient({
    url: 'ws://' + host + ':' + port + '/config'
  }),
  responder: configResponder
});

function connectConfig() {
  eventLog.add("connection: click");

  clientConfig.connect().subscribe({
    onComplete: socket => {
      eventLog.add("connection: on complete");
      connectionSocket.subsribe(socket);
      socketConfig = socket;
    },
    onError: error => {
      eventLog.add("connection: error " + error);
    },
    onSubscribe: cancel => {
      eventLog.add("connection: on subscribe");
    }
  });
}

document.getElementById("connectConfig").addEventListener('click', (e:Event) => connectConfig());