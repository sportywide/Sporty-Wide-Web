import * as mongoose from 'mongoose';
import * as uuidv4 from 'uuid/v4';

export const FormSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: String,
  fields: [mongoose.Schema.Types.Mixed]
});

export interface IForm {
  id: string;
  name: string;
  fields: IFormField[];
}

export enum FieldType {
  Textbox = 'textbox',
  Dropdown = 'dropdown',
  Checkbox = 'checkbox',
  Textarea = 'textarea',
  File = 'file'
}

export interface IFieldOption {
  label: string;
  value: any;
}

export interface IFormField {
  id: string;
  type: FieldType;
  label: string;
  value: any;
  placeholder?: string;
  options?: IFieldOption[];
}
