import { ReactiveSocket, Encodable } from 'rsocket-types';
import { EventLog } from "./eventLog";

export class ConnectionSocket {

  private eventLog: EventLog;

  constructor() {
    this.eventLog = new EventLog();
  }

  public subsribe(socket: ReactiveSocket<any, Encodable>) {
    socket.connectionStatus().subscribe(connectionStatus => {
      this.eventLog.add("connection status: status " + connectionStatus.kind);
    });
  
    socket.connectionStatus().subscribe({
      onComplete: () => {
        this.eventLog.add("connection status: on complete");
      },
      onError: error => {
        this.eventLog.add("connection status: error " + error);
      },
      onNext: value => {
        this.eventLog.add("connection status: on next " + value);
      },
      onSubscribe: subscription => {
        this.eventLog.add("connection status: on subscribe, name:" + subscription.request.name + ", length: " + subscription.request.length + ", prototype: " +  subscription.request.prototype);
      }
    });
  }
}

