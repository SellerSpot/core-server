import { MONGOOSE_MODELS } from 'config/mongooseModels';
import { Schema, model, Model, Document } from 'mongoose';

const BaseSchema = new Schema({
    name: String,
});

export interface IBase {
    name: string;
}

export type IBaseModel = Model<IBase & Document>;

export const BaseModel: IBaseModel = model(MONGOOSE_MODELS.BASE, BaseSchema);
