package com.sebczu.poc.rsocket.player;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.rsocket.RSocketRequester;
import org.springframework.test.context.TestPropertySource;

import java.net.URI;

@TestPropertySource(properties = {"spring.rsocket.server.transport=websocket"})
public class WsPlayerControllerTest extends PlayerControllerTest {

    private RSocketRequester wsRequester;

    @BeforeEach
    public void setupTcpRequester(@Autowired RSocketRequester.Builder builder, @Value("${spring.rsocket.server.port}") Integer port) {
        wsRequester = builder
                .connectWebSocket(URI.create("ws://localhost:" + port))
                .block();
    }

    @AfterEach
    public void disposeTcpRequester() {
        wsRequester.rsocket().dispose();
    }

    @Override
    protected RSocketRequester getRequester() {
        return wsRequester;
    }

}
