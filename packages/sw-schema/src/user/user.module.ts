import { Module } from '@nestjs/common';
import { User } from '@schema/user/models/user.entity';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { UserProfile } from '@schema/user/profile/models/user-profile.entity';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPreferenceSchema } from '@schema/user/models/user-preference.schema';
import { UserPreferenceService } from '@schema/user/services/user-preference.service';

@Module({
	imports: [
		CoreSchemaModule,
		SwRepositoryModule.forFeature({ entities: [User, UserProfile] }),
		MongooseModule.forFeature([{ name: 'UserPreference', schema: UserPreferenceSchema }]),
	],
	providers: [UserPreferenceService],
	exports: [SwRepositoryModule, UserPreferenceService],
})
export class SchemaUserModule {}
