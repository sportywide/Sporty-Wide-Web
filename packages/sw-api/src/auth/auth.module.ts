import { Module } from '@nestjs/common';
import { AuthService } from '@api/auth/services';

@Module({
  imports: [],
  controllers: [],
  providers: [AuthService]
})
export class AuthModule {}
