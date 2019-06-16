import { Module } from '@nestjs/common';
import { UserService } from '@api/user/services/user.service';
import { SchemaModule } from '@schema/schema.module';

@Module({
	imports: [SchemaModule],
	controllers: [],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
