import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './db/entities/user.entity';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) { }

  async getHello(): Promise<string> {
    const user = await this.userRepository.find(); // Example usage of the injected repository
    console.log(user);
    return new Promise((resolve) => resolve('Hello World!'));
  }
}
