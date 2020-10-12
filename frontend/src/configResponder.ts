import { Responder, Payload } from 'rsocket-types';
import { Flowable, Single } from 'rsocket-flowable';
import { EventLog } from "./eventLog";

const eventLog = new EventLog();

export class ConfigResponder implements Responder<any, string> {
  metadataPush(payload: Payload<any, string>): Single<void> {
    return Single.error(new Error('not implemented'));
  }

  fireAndForget(payload: Payload<any, string>): void {
    document.getElementById("actualConnection").innerText = payload.data.actualConnection;
  }

  requestResponse(payload: Payload<any, string>): Single<Payload<any, string>> {
    return Single.error(new Error('not implemented'));
  }

  requestStream(payload: Payload<any, string>): Flowable<Payload<any, string>> {
    return Flowable.error(new Error('not implemented'));
  }

  requestChannel(payloads: Flowable<Payload<any, string>>): Flowable<Payload<any, string>> {
    return Flowable.error(new Error('not implemented'));
  }
}