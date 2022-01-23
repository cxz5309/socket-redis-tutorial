import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { RoomsService } from './rooms.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class RoomsGateway {
  constructor(private readonly roomsService: RoomsService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createRoom')
  create(@MessageBody() roomName: string, @ConnectedSocket() socket: Socket) {
    return this.roomsService.create(roomName);
  }

  @SubscribeMessage('findAllRooms')
  findAll() {
    return this.roomsService.findAll();
  }

  @SubscribeMessage('findOneRoom')
  findOne(@MessageBody() id: number) {
    return this.roomsService.findOne(id);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() roomName: string, @ConnectedSocket() socket: Socket) {
    const clientSockets = this.roomsService.rooms.has(roomName)
      ? this.roomsService.rooms.get(roomName)
      : new Set();
    clientSockets.add(socket.id);
    this.roomsService.rooms.set(roomName, clientSockets);
    console.log('clientSockets', clientSockets);
    console.log('rooms', this.roomsService.rooms);

    socket.join(roomName);
    this.server.to(roomName).emit('joinRoomRes', {
      room: roomName,
      msg: `[uid: ${socket.id}] 님이 입장하였습니다.`,
    });
    return this.roomsService.join(roomName);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(
    @MessageBody() roomName: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const clientSockets = this.roomsService.rooms.has(roomName)
      ? this.roomsService.rooms.get(roomName)
      : new Set();
    clientSockets.delete(socket.id);
    this.roomsService.rooms.set(roomName, clientSockets);
    console.log('clientSockets', clientSockets);
    console.log('rooms', this.roomsService.rooms);

    socket.leave(roomName);
    this.server.to(roomName).emit('leaveRoomRes', {
      room: roomName,
      msg: `[uid: ${socket.id}] 님이 나갔습니다.`,
    });
    return this.roomsService.join(roomName);
  }

  @SubscribeMessage('chat')
  chat(@MessageBody() data: string, @ConnectedSocket() socket: Socket) {
    const clientRooms = socket.rooms;
    console.log('clientRooms', clientRooms);
    for (let room of clientRooms) {
      if (room !== socket.id) {
        this.server.to(room).emit('chatRes', {
          room,
          msg: data,
        });
      }
    }
    return this.roomsService.chat(data);
  }

  @SubscribeMessage('removeRoom')
  remove(@MessageBody() id: number) {
    return this.roomsService.remove(id);
  }
}
