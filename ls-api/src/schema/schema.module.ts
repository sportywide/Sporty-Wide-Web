import { Module } from '@nestjs/common';
import { AuthService } from '@app/auth/services';
import { SchemaController } from '@app/schema/schema.controller';
import { SchemaService } from '@app/schema/services';
import { MongooseModule } from '@nestjs/mongoose';
import { FormSchema } from '@app/schema/models';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Form', schema: FormSchema }])],
  controllers: [SchemaController],
  providers: [AuthService, SchemaService],
})
export class SchemaModule {
}
