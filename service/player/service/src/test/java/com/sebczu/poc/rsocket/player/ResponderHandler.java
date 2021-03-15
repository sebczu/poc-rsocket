package com.sebczu.poc.rsocket.player;

import com.sebczu.poc.rsocket.player.domain.Config;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import reactor.core.publisher.Mono;

@Slf4j
@Getter
public class ResponderHandler {

  private Config config;

  @MessageMapping("push")
  public Mono<Void> push(Config config) {
    log.info("config: {}", config);
    this.config = config;
    return Mono.empty();
  }

}
