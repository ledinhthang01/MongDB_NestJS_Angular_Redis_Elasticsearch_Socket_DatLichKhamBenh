import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from './auth/auth.service';

const options = {
  cors: {
    origin: '*',
    credentials: true,
  },
};

@WebSocketGateway(options)
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly authService: AuthService) {}

  handleEmiSocket({ data, event, to }) {
    if (to) {
      this.server.to(to.map((el) => String(el))).emit(event, data);
    } else {
      this.server.emit(event, data);
    }
  }

  @SubscribeMessage('abc')
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    console.log('abc: ', data);
    setTimeout(() => {
      this.server.to(socket.data.id).emit('abc', data);
    }, 2000);
  }

  async handleConnection(socket: Socket) {
    const authHeader = socket.handshake.headers.authorization;
    if (authHeader) {
      try {
        socket.data.id = await this.authService.handleVerifyToken(
          socket.handshake.headers.authorization,
        );

        socket.join(socket.data.id);
      } catch (error) {
        socket.disconnect();
      }
    } else {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    console.log(socket.id, socket.data.id);
  }

  afterInit(socket: Socket) {}
}
