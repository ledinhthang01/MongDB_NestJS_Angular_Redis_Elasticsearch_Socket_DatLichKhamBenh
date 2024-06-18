import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

const options = {
  cors: {
    origin: '*',
    credentials: true,
  },
};

@WebSocketGateway(options)
export class EventGateway {
  @WebSocketServer()
  server: Server;

  handleEmiSocket(data: any, event: any, to?: any) {
    if (to) {
      this.server.in(String(to)).emit(event, data);
    } else {
      this.server.emit(event, String(data));
    }
  }

  @SubscribeMessage('stopTyping')
  async handleStopTyping(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data,
  ) {
    this.server.in(String(data.message));
  }

  @SubscribeMessage('typing')
  async handleTyping(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    this.server.in(String(data.message));
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    socket.join(String(data.message));
  }

  @SubscribeMessage('signIn')
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    socket.join(String(data.message));
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data,
  ) {
    socket.leave(String(data.message));
  }
}
