import { Injectable } from '@nestjs/common';
import { ITokenPayload } from '@app/auth/models';
import { decode } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor() {}

  getTokenPayload(token: string): ITokenPayload {
    return decode(token) as ITokenPayload;
  }
}
