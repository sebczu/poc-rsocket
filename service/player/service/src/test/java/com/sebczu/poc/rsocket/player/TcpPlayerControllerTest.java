package com.sebczu.poc.rsocket.player;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.rsocket.context.LocalRSocketServerPort;
import org.springframework.messaging.rsocket.RSocketRequester;
import org.springframework.test.context.TestPropertySource;

@TestPropertySource(properties = {"spring.rsocket.server.transport=tcp"})
public class TcpPlayerControllerTest extends PlayerControllerTest {

    private RSocketRequester tcpRequester;

    @BeforeEach
    public void setupTcpRequester(@Autowired RSocketRequester.Builder builder, @LocalRSocketServerPort Integer port) {
        tcpRequester = builder
                .connectTcp("localhost", port)
                .block();
    }

    @AfterEach
    public void disposeTcpRequester() {
        tcpRequester.rsocket().dispose();
    }

    @Override
    protected RSocketRequester getRequester() {
        return tcpRequester;
    }

}
