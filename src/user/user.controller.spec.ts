import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from './dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import mongoose from 'mongoose';

describe('UsersController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn((createUserDto) => {
      return {
        id: 1,
        _id: new mongoose.Types.ObjectId().toString(),
        __v: 0,
        ...createUserDto,
      };
    }),
    findByEmail: jest.fn((email: string) => {
      return {
        id: 1,
        email,
        first_name: 'Luke',
        last_name: 'Skywalker',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      };
    }),
    findById: jest.fn((id: number) => {
      return {
        id,
        email: 'lukeskywalker@jedi.com',
        first_name: 'Luke',
        last_name: 'Skywalker',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      };
    }),
    getAvatar: jest.fn(() => {
      return Buffer.from('generate-a-base64-string').toString('base64');
    }),
    deleteAvatar: jest.fn((id: number) => {
      return {
        id,
        _id: new mongoose.Types.ObjectId().toString(),
        __v: 0,
        first_name: 'Luke',
        last_name: 'Skywalker',
        email: 'lukeskywalker@jedi.com',
        avatar: '',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const newUser: CreateUserDTO = {
      first_name: 'Luke',
      last_name: 'Skywalker',
      email: 'lukeskywalker@jedi.com',
    };
    expect(controller.createUser(newUser)).toEqual({
      id: expect.any(Number),
      _id: expect.any(String),
      __v: expect.any(Number),
      ...newUser,
    });
  });

  it('should get a user by id', () => {
    expect(controller.findById(1)).toEqual({
      id: 1,
      email: expect.any(String),
      first_name: expect.any(String),
      last_name: expect.any(String),
      avatar: expect.any(String),
    });
  });

  it('should return a base64 of the avatar for the given user', async () => {
    expect(await controller.getAvatar(1)).toEqual(expect.any(String));
  });

  it('should remove avatar reference', async () => {
    expect(await controller.deleteAvatar(1)).toEqual({
      id: expect.any(Number),
      _id: expect.any(String),
      __v: expect.any(Number),
      email: expect.any(String),
      first_name: expect.any(String),
      last_name: expect.any(String),
      avatar: '',
    });
  });
});
