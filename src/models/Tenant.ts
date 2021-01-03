import { MONGOOSE_MODELS } from 'config/mongooseModels';
import { Schema, model, Model, Document } from 'mongoose';

const TenantSchema = new Schema({
    name: String,
    email: String,
    password: String,
    subDomain: { type: Schema.Types.ObjectId, ref: MONGOOSE_MODELS.TENANT },
    apps: [{ type: Schema.Types.ObjectId, ref: MONGOOSE_MODELS.APP }],
});

export interface ITenant {
    name: string;
    email: string;
    password: string;
    subDomain?: string;
    apps?: string[];
}

export type ITenantModel = Model<ITenant & Document>;

export const TenantModel: ITenantModel = model(MONGOOSE_MODELS.TENANT, TenantSchema);
