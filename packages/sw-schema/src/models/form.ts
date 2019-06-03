import * as mongoose from 'mongoose';
import * as uuidv4 from 'uuid/v4';

export const FormSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: String,
  fields: [mongoose.Schema.Types.Mixed]
});
