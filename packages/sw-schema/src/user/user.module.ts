import { Module } from '@nestjs/common';
import { User } from '@schema/user/models/user.entity';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { UserProfile } from '@schema/user/profile/models/user-profile.entity';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';
import { UserScore } from '@schema/user/models/user-score.entity';

@Module({
	imports: [CoreSchemaModule, SwRepositoryModule.forFeature({ entities: [User, UserProfile, UserScore] })],
	providers: [],
	exports: [SwRepositoryModule],
})
export class SchemaUserModule {}
