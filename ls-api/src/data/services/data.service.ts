import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFormData } from '@app/data/models';

@Injectable()
export class DataService {
  constructor(@InjectModel('FormData') private readonly formDataModel: Model<IFormData>) {}

  async saveFormData(payload: IFormData): Promise<any> {
    const newFormData = new this.formDataModel(payload);
    return await newFormData.save();
  }

  async getFormDatas(): Promise<IFormData[]> {
    const result = await this.formDataModel.find();
    return result.map(toDtoModel);
  }
}

function toDtoModel(payload: any): IFormData {
  const { data, date } = payload;
  return { data, date };
}
