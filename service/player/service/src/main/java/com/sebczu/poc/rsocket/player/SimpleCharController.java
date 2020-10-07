package com.sebczu.poc.rsocket.player;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Slf4j
@Controller
public class SimpleCharController {

    //strategy: request-stream
    @MessageMapping("char")
    public Flux<SimpleChar> toCharacter(String toSplit) {
        log.info("to character: {}", toSplit);
        return Flux.fromStream(toSplit.chars()
                .mapToObj(c -> new SimpleChar(Character.toString(c))))
                .delayElements(Duration.ofMillis(1000));
    }


}
