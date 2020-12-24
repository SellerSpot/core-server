import { MONGOOSE_MODELS } from 'config/mongooseModels';
import { Schema, model, Model, Document } from 'mongoose';

const TenantSchema = new Schema({
    name: String,
    email: String,
    password: String,
});

export interface ITentat {
    name: string;
    email: string;
    password: string;
}

export type ITentatModel = Model<ITentat & Document>;

export const BaseModel: ITentatModel = model(MONGOOSE_MODELS.TENANT, TenantSchema);
