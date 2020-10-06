package com.sebczu.poc.rsocket.player;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.TestPropertySource;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
@TestPropertySource(properties = {"spring.rsocket.server.transport=tcp"})
public class TcpPlayerControllerTest extends PlayerControllerTest {

    @Test
    public void fireAndForget() {
        Mono<Void> result = tcpRequester
                .route("save")
                .data("test text")
                .send();

        StepVerifier
                .create(result)
                .verifyComplete();
    }

    @Test
    public void requestResponse() {
        Mono<String> result = tcpRequester
                .route("hello")
                .data("test text")
                .retrieveMono(String.class);

        StepVerifier
                .create(result)
                .consumeNextWith(response -> {
                    assertThat(response).isEqualTo("hello test text");
                })
                .verifyComplete();
    }

    @Test
    public void requestStream() {
        Flux<String> result = tcpRequester
                .route("split")
                .data("test")
                .retrieveFlux(String.class);

        StepVerifier
                .create(result)
                .consumeNextWith(response -> {
                    assertThat(response).isEqualTo("t");
                })
                .expectNextCount(2)
                .consumeNextWith(response -> {
                    assertThat(response).isEqualTo("t");
                })
                .verifyComplete();
    }

    @Test
    public void requestChannel() {
        Flux<String> request = Flux.fromStream(List.of("1", "2", "3").stream());

        Flux<String> result = tcpRequester
                .route("message")
                .data(request)
                .retrieveFlux(String.class);

        StepVerifier
                .create(result)
                .consumeNextWith(response -> {
                    log.info("response 1");
                    assertThat(response).isEqualTo("response to message: 1");
                })
                .consumeNextWith(response -> {
                    log.info("response 2");
                    assertThat(response).isEqualTo("response to message: 2");
                })
                .consumeNextWith(response -> {
                    log.info("response 3");
                    assertThat(response).isEqualTo("response to message: 3");
                })
                .verifyComplete();
    }

}
