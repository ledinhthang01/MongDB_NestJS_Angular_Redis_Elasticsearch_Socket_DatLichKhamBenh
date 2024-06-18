import {
  ConnectedSocket,
  MessageBody,
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
      this.server.to(String(to)).emit(event, data);
    } else {
      this.server.emit(event, String(data));
    }
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    socket.to(String(data.message)).emit('stopTyping');
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    socket.to(String(data.message)).emit('typing');
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    socket.join(String(data.message));
  }

  @SubscribeMessage('signIn')
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    socket.join(String(data.message));
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    socket.leave(String(data.message));
  }
}
