import { Injectable } from '@nestjs/common';
import { BaseEntityService } from '@schema/core/entity/base-entity.service';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { UserProfile } from '@schema/user/profile/models/user-profile.entity';

@Injectable()
export class UserProfileService extends BaseEntityService<UserProfile> {
	constructor(@InjectSwRepository(UserProfile) private readonly userProfileRepository: SwRepository<UserProfile>) {
		super(userProfileRepository);
	}
}
