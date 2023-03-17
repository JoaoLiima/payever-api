import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import * as pack from '../package.json';

describe('UsersController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should verify if the api is healthy', () => {
    expect(controller.httpStatus()).toEqual({
      status: 'ok',
      version: pack.version,
    });
  });
});
