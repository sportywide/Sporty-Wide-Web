import { Injectable } from '@nestjs/common';
import { BaseEntityService } from '@api/core/services/entity/base-entity.service';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { UserProfile } from '@schema/user/profile/models/user-profile.entity';
import { UserProfileDto } from '@shared/lib/dtos/user/profile/user-profile.dto';

@Injectable()
export class UserProfileService extends BaseEntityService<UserProfile> {
	constructor(@InjectSwRepository(UserProfile) private readonly userProfileRepository: SwRepository<UserProfile>) {
		super(userProfileRepository);
	}

	async saveUserProfile(userProfileDto: UserProfileDto) {
		let userProfile = this.createOneEntity(userProfileDto);
		userProfile = await this.saveOne(userProfile);
		return userProfile;
	}
}
