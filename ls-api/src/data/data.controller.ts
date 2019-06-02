import { Body, Controller, Get, Post } from '@nestjs/common';
import { DataService } from '@app/data/services';

@Controller('api/data')
export class DataController {
  constructor(private readonly dataSvc: DataService) {
  }

  @Post('submit')
  saveDataBar(@Body() body: any) {
    return this.dataSvc.saveFormData(body);
  }

  @Get()
  getFormDatas() {
    return this.dataSvc.getFormDatas();
  }
}
