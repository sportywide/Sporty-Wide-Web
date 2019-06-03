import { Module } from '@nestjs/common';
import { AuthService } from '@api/auth/services';
import { SchemaController } from '@api/schema/schema.controller';
import { SchemaService } from '@api/schema/services';
import { MongooseModule } from '@nestjs/mongoose';
import { FormSchema } from '@api/schema/models';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Form', schema: FormSchema }])],
  controllers: [SchemaController],
  providers: [AuthService, SchemaService],
})
export class SchemaModule {
}
