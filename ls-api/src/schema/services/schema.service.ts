import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IForm } from '@app/schema/models';

@Injectable()
export class SchemaService {
  constructor(@InjectModel('Form') private readonly formModel: Model<IForm>) {}

  async saveFormSchema(payload: any): Promise<any> {
    const newFormSchema = new this.formModel(toDbModel(payload));
    try {
      return await newFormSchema.save();
    } catch {
      return await this.formModel.updateOne(newFormSchema);
    }
  }

  async getFormSchemas(): Promise<IForm[]> {
    const result = await this.formModel.find();
    return result.map(toDtoModel);
  }

  async deleteFormSchema(formId): Promise<any> {
    return await this.formModel.deleteOne({ _id: formId });
  }
}

function toDbModel(payload: IForm): any {
  payload['_id'] = payload.id;
  delete payload['id'];
  return payload;
}

function toDtoModel(payload: any): IForm {
  const { _id, fields, name } = payload;
  return { id: _id, fields, name };
}
