package com.sebczu.poc.rsocket.player.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.rsocket.RSocketRequester;
import org.springframework.messaging.rsocket.annotation.ConnectMapping;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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
                })
                .doOnError(error -> {
                    log.warn("client: "+client+" error: ", error);
                })
                .doFinally(consumer -> {
                    log.info("client: {} disconnected", client);
                    requesters.remove(client);
                })
                .subscribe();
    }

    public Map<String, RSocketRequester> getRequesters() {
        return requesters;
    }

}
