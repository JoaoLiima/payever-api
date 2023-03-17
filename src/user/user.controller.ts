import { ValidationPipe } from '@/common/pipes/validation.pipe';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body(new ValidationPipe()) createUser: CreateUserDTO) {
    return this.userService.create(createUser);
  }

  @Get(':userId')
  findById(@Param('userId', new ParseIntPipe()) userId: number) {
    return this.userService.findById(userId);
  }

  @Get(':userId/avatar')
  getAvatar(@Param('userId', new ParseIntPipe()) userId: number) {
    return this.userService.getAvatar(userId);
  }

  @Delete(':userId/avatar')
  deleteAvatar(@Param('userId', new ParseIntPipe()) userId: number) {
    return this.userService.deleteAvatar(userId);
  }
}
