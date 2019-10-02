import { Module } from '@nestjs/common';
import { UserService } from '@api/user/services/user.service';
import { SchemaModule } from '@schema/schema.module';
import { UserController } from '@api/user/controllers/user.controller';
import { CoreApiModule } from '@api/core/core-api.module';
import { UserProfileService } from '@api/user/services/user-profile.service';
import { UsersResolver } from '@api/user/resolvers/user.resolver';
import { UserProfileResolver } from '@api/user/resolvers/user-profile.resolver';

@Module({
	imports: [SchemaModule, CoreApiModule],
	controllers: [UserController],
	providers: [UserService, UserProfileService, UsersResolver, UserProfileResolver],
	exports: [UserService, UserProfileService],
})
export class UserModule {}
