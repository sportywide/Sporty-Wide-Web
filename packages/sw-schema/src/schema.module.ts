import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormSchema } from './models/form';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Form', schema: FormSchema }])],
	controllers: [],
	providers: [],
})
export class SchemaModule {}
