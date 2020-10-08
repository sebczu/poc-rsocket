package com.sebczu.poc.rsocket.player.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Slf4j
@Controller
public class PlayerController {

    //strategy: fire-and-forget
    @MessageMapping("save")
    public Mono<Void> saveName(String name) {
        log.info("save name: {}", name);
        return Mono.empty();
    }

    //strategy: request-response
    @MessageMapping("hello")
    public Mono<String> hello(String name) {
        log.info("input: {}", name);
        return Mono.just("hello " + name);
    }

    //strategy: request-stream
    @MessageMapping("split")
    public Flux<String> split(String toSplit) {
        log.info("to split: {}", toSplit);
        return Flux.fromStream(toSplit.chars().mapToObj(Character::toString))
                .delayElements(Duration.ofMillis(1000));
    }

    //strategy: request-channel
    @MessageMapping("message")
    public Flux<String> message(Flux<String> messages) {
        return messages.doOnNext(message -> log.info("message: {}", message))
                .map(message -> "response to message: " + message)
                .delayElements(Duration.ofMillis(1000));
    }

}
