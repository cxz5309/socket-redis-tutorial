import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  rooms = new Map();

  create(roomName: string) {
    console.log(`create ${roomName} Room!!`);
    return 'This action adds a new room';
  }

  findAll() {
    return `This action returns all rooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  join(roomName: string) {
    console.log(`join ${roomName} Room!!`);
    return `This action join ${roomName} room`;
  }

  chat(data: string) {
    console.log(`chat ${data}!!`);
    return `chat ${data}!!`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
