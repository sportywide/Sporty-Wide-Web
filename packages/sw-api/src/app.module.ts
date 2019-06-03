import { AppController } from '@api/app.controller';
import { AppService } from '@api/app.service';
import { AuthModule } from '@api/auth/auth.module';
import { Module } from '@api/common';
import { SharedModule } from '@api/shared/shared.module';
import { DataModule } from '@api/data/data.module';
import { MongooseModule } from '@api/mongoose';
import { SchemaModule } from '@api/schema/schema.module';

@Module({
  imports: [AuthModule, DataModule, SchemaModule, SharedModule, MongooseModule.forRoot('mongodb://localhost/forms')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
