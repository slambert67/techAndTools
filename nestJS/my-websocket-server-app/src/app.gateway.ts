import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';


@WebSocketGateway()  // not specifying port means use same port as app.listen
export class AppGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message_from_client')
  handleMessage(@MessageBody() data: any) {
    console.log('Received from client:', data);

    setInterval( () => {
        this.server.emit('message_from_server', `Hello back: ${data}`);
    }, 3000);
  }
}
