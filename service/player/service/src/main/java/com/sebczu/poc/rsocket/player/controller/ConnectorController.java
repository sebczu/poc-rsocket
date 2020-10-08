package com.sebczu.poc.rsocket.player.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.rsocket.RSocketRequester;
import org.springframework.messaging.rsocket.annotation.ConnectMapping;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class ConnectorController {

    @ConnectMapping("client")
    public void clientConnect(RSocketRequester requester, @Payload String client) {
        System.out.println("requester " + requester);
        System.out.println("client " + client);
    }

}
