import { RSocketClient} from "rsocket-core";
import { ReactiveSocket, Encodable, ISubscription } from 'rsocket-types';
import RSocketWebSocketClient from "rsocket-websocket-client";
import { Flowable } from 'rsocket-flowable';
import { ConnectionSocket } from "./connectionSocket";
import { EventLog } from "./eventLog";

let socketRequestChannel: ReactiveSocket<any, Encodable>;
let subscriptionRequestChannel: ISubscription;

let clientId = Math.floor((Math.random() * 10000) + 1);
let keepAlive = 60000;
let lifetime = 70000;

const eventLog = new EventLog();
const connectionSocket = new ConnectionSocket();

const clientRequestChannel = new RSocketClient({
  setup: {
    payload: {
      data: "clientId-requestchannel-" + clientId,
      metadata: String.fromCharCode("client".length) + "client"
    },
    keepAlive: keepAlive,
    lifetime: lifetime,
    dataMimeType: 'text/plain',
    metadataMimeType: 'message/x.rsocket.routing.v0',
  },
  transport: new RSocketWebSocketClient({
    url: 'ws://localhost:7000/requestchannel'
  })
});

function connectRequestChannel() {
  eventLog.add("connection: click");

  clientRequestChannel.connect().subscribe({
    onComplete: socket => {
      socketRequestChannel = socket;
      connectionSocket.subsribe(socketRequestChannel);
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

function sendRequestChannel() {
  eventLog.add("request: click");

  socketRequestChannel.requestChannel(
    Flowable.just({
      data: 'first',
      metadata: String.fromCharCode('requestchannel'.length) + 'requestchannel',
    }, {
      data: 'second',
      metadata: String.fromCharCode('requestchannel'.length) + 'requestchannel',
    })
  ).subscribe({
    onComplete: () => {
      eventLog.add("request: on complete");
    },
    onError: error => {
      eventLog.add("request: error " + error);
    },
    onNext: payload => {
      eventLog.add("request: on next data: " + payload.data + ", metadata: " + payload.metadata);
    },
    onSubscribe: subscription => {
      subscriptionRequestChannel = subscription;
      subscription.request(100);
      eventLog.add("request: on subscribe");
    },
  });
}

function cancelRequestChannel() {
  eventLog.add("cancel: click");
  subscriptionRequestChannel.cancel();
}

function closeRequestChannel() {
  eventLog.add("close: click");
  socketRequestChannel.close();
}

document.getElementById("connectRequestChannel").addEventListener('click', (e:Event) => connectRequestChannel());
document.getElementById("sendRequestChannel").addEventListener('click', (e:Event) => sendRequestChannel());
document.getElementById("cancelRequestChannel").addEventListener('click', (e:Event) => cancelRequestChannel());
document.getElementById("closeRequestChannel").addEventListener('click', (e:Event) => closeRequestChannel());
