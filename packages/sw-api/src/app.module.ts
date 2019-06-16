import { SchemaModule } from '@schema/schema.module';
import { AuthModule } from '@api/auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from '@api/app.controller';
import { AppService } from '@api/app.service';
import { SharedModule } from '@api/shared/shared.module';
import { configProvider } from '@api/config.provider';
import { UserModule } from '@api/user/user.module';

@Module({
	imports: [AuthModule, SharedModule, SchemaModule, UserModule],
	controllers: [AppController],
	providers: [AppService, configProvider],
})
export class AppModule {}
