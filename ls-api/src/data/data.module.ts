import { Module } from '@nestjs/common';
import { AuthService } from '@app/auth/services';
import { DataController } from '@app/data/data.controller';
import { DataService } from '@app/data/services';
import { MongooseModule } from '@nestjs/mongoose';
import { FormDataSchema } from '@app/data/models';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'FormData', schema: FormDataSchema }])],
  controllers: [DataController],
  providers: [AuthService, DataService],
})
export class DataModule {
}
