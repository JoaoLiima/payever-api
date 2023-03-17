import { Controller, Get } from '@nestjs/common';
import * as pack from '../package.json';

@Controller()
export class AppController {
  @Get('/healthz')
  httpStatus() {
    return {
      status: 'ok',
      version: pack.version,
    };
  }
}
