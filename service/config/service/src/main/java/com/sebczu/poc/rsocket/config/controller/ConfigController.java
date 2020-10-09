package com.sebczu.poc.rsocket.config.controller;

import com.sebczu.poc.rsocket.player.controller.ConnectorController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Mono;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ConfigController {

    private final ConnectorController connectorController;

    @MessageMapping("config")
    public Mono<Config> getConfig(String text) {
        Config config = new Config();
        config.setActualConnection(connectorController.getRequesters().size());
        return Mono.just(config);
    }
}
