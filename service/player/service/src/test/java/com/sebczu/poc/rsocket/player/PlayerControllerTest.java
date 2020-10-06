package com.sebczu.poc.rsocket.player;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.messaging.rsocket.RSocketRequester;

@SpringBootTest
public abstract class PlayerControllerTest {

    protected RSocketRequester tcpRequester;

    @BeforeEach
    public void setupTcpRequester(@Autowired RSocketRequester.Builder builder, @Value("${spring.rsocket.server.port}") Integer port) {
        tcpRequester = builder
                .connectTcp("localhost", port)
                .block();
    }

    @AfterEach
    public void disposeTcpRequester() {
        tcpRequester.rsocket().dispose();
    }

}
