import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { AuthModule } from '@app/auth/auth.module';
import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared/shared.module';
import { DataModule } from '@app/data/data.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemaModule } from '@app/schema/schema.module';

@Module({
  imports: [AuthModule, DataModule, SchemaModule, SharedModule, MongooseModule.forRoot('mongodb://localhost/forms')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
