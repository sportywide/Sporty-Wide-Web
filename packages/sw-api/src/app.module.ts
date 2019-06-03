import {SchemaModule} from '@schema/schema.module';
import {AuthModule} from '@api/auth/auth.module';
import { Module } from '@nestjs/common';
import {AppController} from '@api/app.controller';
import {AppService} from '@api/app.service';
import {SharedModule} from '@api/shared/shared.module';

@Module({
    imports: [AuthModule, SharedModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
