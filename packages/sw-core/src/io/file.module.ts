import { Module } from '@nestjs/common';
import { fileProvider } from '@core/io/file.provider';

@Module({
	providers: [fileProvider],
	exports: [fileProvider],
})
export class FileModule {}
