package com.sebczu.poc.rsocket.player;

import io.rsocket.SocketAcceptor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.rsocket.context.LocalRSocketServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.messaging.rsocket.RSocketRequester;
import org.springframework.messaging.rsocket.RSocketStrategies;
import org.springframework.messaging.rsocket.annotation.support.RSocketMessageHandler;
import org.springframework.test.context.TestPropertySource;

import java.net.URI;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@TestPropertySource(properties = {"spring.rsocket.server.transport=websocket"})
public class PushControllerTest {

  @Autowired
  private RSocketStrategies strategies;
  @Autowired
  private RSocketRequester.Builder builder;
  @LocalRSocketServerPort
  private Integer port;

  @Test
  public void pushTest() throws InterruptedException {
    ResponderHandler handler = new ResponderHandler();
    SocketAcceptor acceptor = RSocketMessageHandler.responder(strategies, handler);

    RSocketRequester requester = builder
        .setupRoute("client")
        .setupData("clientId-config")
        .rsocketConnector(rSocketConnector -> rSocketConnector.acceptor(acceptor))
        .connectWebSocket(URI.create("ws://localhost:" + port))
        .block();

    Thread.sleep(300);
    assertThat(handler.getConfig()).isNotNull();

    requester.rsocket().dispose();
  }

}
