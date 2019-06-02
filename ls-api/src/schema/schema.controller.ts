import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SchemaService } from '@app/schema/services';

@Controller('api/form')
export class SchemaController {
  constructor(private readonly schemaSvc: SchemaService) {}

  @Post()
  saveFormSchema(@Body() body: any) {
    return this.schemaSvc.saveFormSchema(body);
  }

  @Get()
  getFormSchemas() {
    return this.schemaSvc.getFormSchemas();
  }

  @Delete(':formId')
  deleteFormSchema(@Param() param: any) {
    return this.schemaSvc.deleteFormSchema(param['formId']);
  }
}
