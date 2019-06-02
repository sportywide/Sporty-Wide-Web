import { Module } from '@nestjs/common';
import { AuthService } from '@app/auth/services';

@Module({
  imports: [],
  controllers: [],
  providers: [AuthService]
})
export class AuthModule {}
