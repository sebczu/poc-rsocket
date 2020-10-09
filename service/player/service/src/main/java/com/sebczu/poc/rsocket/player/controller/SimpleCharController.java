package com.sebczu.poc.rsocket.player.controller;

import com.sebczu.poc.rsocket.player.domain.SimpleChar;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Slf4j
@Controller
public class SimpleCharController {

    @MessageMapping("fireandforget")
    public Mono<Void> fireAndForget(String text) {
        log.info("receive text: {}", text);
        return Mono.empty();
    }

    @MessageMapping("requestresponse")
    public Mono<SimpleChar> requestResponse(String text) {
        log.info("receive text: {}", text);
        return Mono.just(new SimpleChar("hello: " + text));
    }

    @MessageMapping("requeststream")
    public Flux<SimpleChar> requestStream(String text) {
        log.info("receive text: {}", text);
        return Flux.fromStream(text.chars()
                .mapToObj(c -> new SimpleChar(Character.toString(c))))
                .delayElements(Duration.ofMillis(1000));
    }

    @MessageMapping("requestchannel")
    public Flux<String> requestChannel(Flux<String> texts) {
        log.info("receive text: {}", texts);
        return texts.doOnNext(text -> log.info("message: {}", text))
                .map(text -> "hello: " + text)
                .delayElements(Duration.ofMillis(1000));
    }
}
