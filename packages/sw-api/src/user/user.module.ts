import { Module } from '@nestjs/common';
import { UserService } from '@api/user/services/user.service';
import { SchemaModule } from '@schema/schema.module';
import { Usercontroller } from '@api/user/controllers/user.controller';

@Module({
	imports: [SchemaModule],
	controllers: [Usercontroller],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
