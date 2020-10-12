import { RSocketClient,
  JsonSerializer,
  IdentitySerializer } from "rsocket-core";
import { Encodable } from 'rsocket-types';
import RSocketWebSocketClient from "rsocket-websocket-client";
import { EventLog } from "./eventLog";

let clientId = Math.floor((Math.random() * 10000) + 1);
let keepAlive = 60000;
let lifetime = 70000;

const eventLog = new EventLog();

function getClient(): RSocketClient<any, Encodable> {
  return new RSocketClient({
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
}

function reconnect() {
  eventLog.add("connection: click");

  getClient().connect().subscribe({
    onComplete: socket => {
      eventLog.add("connection: on complete");

      socket.connectionStatus().subscribe(connectionStatus => {
        if (connectionStatus.kind == 'ERROR') {
          eventLog.add("connection status: status " + connectionStatus.kind + " error: " + connectionStatus.error);
        } else {
          eventLog.add("connection status: status " + connectionStatus.kind);
        }

        if (connectionStatus.kind == 'CLOSED' || connectionStatus.kind == 'ERROR') {
          tryConnect();
        }
      });

    },
    onError: error => {
      eventLog.add("connection: error " + error);
      tryConnect();
    },
    onSubscribe: cancel => {
      eventLog.add("connection: on subscribe");
    }
  });
}

function tryConnect() {
  setTimeout(() => { 
    reconnect(); 
  }, 1000);
}

document.getElementById("reconnect").addEventListener('click', (e:Event) => reconnect());
