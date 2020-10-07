const {
  RSocketClient,
  JsonSerializer,
  IdentitySerializer
} = require('rsocket-core');
const RSocketWebSocketClient = require('rsocket-websocket-client').default;
var client = undefined;


function main() {
    console.log("start");

  if (client !== undefined) {
    client.close();
  }

  // Create an instance of a client
  client = new RSocketClient({
    serializers: {
      data: JsonSerializer,
      metadata: IdentitySerializer
    },
    setup: {
      // ms btw sending keepalive to server
      keepAlive: 60000,
      // ms timeout if no keepalive response
      lifetime: 180000,
      // format of `data`
      dataMimeType: 'application/json',
      // format of `metadata`
      metadataMimeType: 'message/x.rsocket.routing.v0',
    },
    transport: new RSocketWebSocketClient({
      url: 'ws://localhost:7000/char'
    }),
  });

  // Open the connection
  client.connect().subscribe({
    onComplete: socket => {
      // socket provides the rsocket interactions fire/forget, request/response,
      // request/stream, etc as well as methods to close the socket.
      socket.requestStream({
        data: 'example text',
        metadata: String.fromCharCode('char'.length) + 'char',
      }).subscribe({
        onComplete: () => console.log('complete'),
        onError: error => {
          console.log(error);
//          addErrorMessage("Connection has been closed due to ", error);
        },
        onNext: payload => {
          console.log(payload.data);
//          addMessage(payload.data);
        },
        onSubscribe: subscription => {
          subscription.request(100);
        },
      });
    },
    onError: error => {
      console.log(error);
//      addErrorMessage("Connection has been refused due to ", error);
    },
    onSubscribe: cancel => {
        console.log('onSubscribe');
      /* call cancel() to abort */
    }
  });
}

document.addEventListener('DOMContentLoaded', main);