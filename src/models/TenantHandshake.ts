import { MONGOOSE_MODELS } from 'config/mongooseModels';
import { Schema, model, Model, Document } from 'mongoose';

const TenantHandshake = new Schema({
    tenantId: String,
    name: String,
    email: String,
});

export interface ITenantHandshake {
    tenantId: string;
    name: string;
    email: string;
}

export type ITenantHandshakeModel = Model<ITenantHandshake & Document>;

export const BaseModel: ITenantHandshakeModel = model(
    MONGOOSE_MODELS.TENANT_HANDSHAKE,
    TenantHandshake,
);
