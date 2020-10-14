package com.sebczu.poc.rsocket.player.controller;

import com.sebczu.poc.rsocket.player.domain.Config;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.rsocket.RSocketRequester;
import org.springframework.messaging.rsocket.annotation.ConnectMapping;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class ConnectorController {

  private Map<String, RSocketRequester> requesters = new ConcurrentHashMap<>();

  @ConnectMapping("client")
  public void clientConnect(RSocketRequester requester, @Payload String client) {
    requester.rsocket()
        .onClose()
        .doFirst(() -> {
          log.info("client: {} connected.", client);
          requesters.put(client, requester);
          pushMessage();
        })
        .doOnError(error -> {
          log.warn("client: " + client + " error: ", error);
        })
        .doFinally(consumer -> {
          log.info("client: {} disconnected", client);
          requesters.remove(client);
          pushMessage();
        })
        .subscribe();
  }

  private void pushMessage() {
    requesters.entrySet()
        .stream()
        .filter(entry -> entry.getKey().contains("clientId-config"))
        .forEach(entry -> {
          log.info("push message");
          RSocketRequester requester = entry.getValue();
          requester.route("client")
              .data(new Config(requesters.size()))
              .send()
              .subscribe();
        });
  }
}
