import {
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

export class XNotFound extends NotFoundException {
  constructor(x: string) {
    super(`${x} not found`);
  }
}

export class PermisionException extends UnauthorizedException {
  constructor() {
    super('You have not permision');
  }
}

export class XAlreadyExists extends ConflictException {
  constructor(private x: string) {
    super(`${x} already exists`);
  }
}

export class ServerError extends InternalServerErrorException {
  constructor(private x: string) {
    super(`Wrong ${x}`);
  }
}
