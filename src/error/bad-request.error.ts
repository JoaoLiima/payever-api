import { DefaultError } from '@/error/default.error';
import { HttpStatus } from '@nestjs/common';

export class BadRequestError extends DefaultError {
  constructor(message?: string, error?: Error) {
    super(error, message, 'BAD_REQUEST_ERROR', HttpStatus.BAD_REQUEST);
  }
}
