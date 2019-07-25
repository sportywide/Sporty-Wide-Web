import { Module } from '@nestjs/common';
import { UserService } from '@api/user/services/user.service';
import { SchemaModule } from '@schema/schema.module';
import { UserController } from '@api/user/controllers/user.controller';
import { CoreApiModule } from '@api/core/core-api.module';

@Module({
	imports: [SchemaModule, CoreApiModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
