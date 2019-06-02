import * as mongoose from 'mongoose';

export const FormDataSchema = new mongoose.Schema({
  date: Date,
  data: mongoose.Schema.Types.Mixed
});

export interface IFormData {
  date: Date;
  data: { [key: string]: any; };
}
