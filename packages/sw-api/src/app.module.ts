import { SchemaModule } from '@schema/schema.module';
import { AuthModule } from '@api/auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from '@api/app.controller';
import { AppService } from '@api/app.service';
import { SharedModule } from '@api/shared/shared.module';
import { UserModule } from '@api/user/user.module';
import { CoreApiModule } from '@api/core/core-api.module';
import { CoreModule } from '@core/core.module';

@Module({
	imports: [AuthModule, SharedModule, SchemaModule, UserModule, CoreApiModule, CoreModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
