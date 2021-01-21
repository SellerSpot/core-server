import { MONGOOSE_MODELS } from 'models/mongooseModels';
import { Schema, model, Model, Document } from 'mongoose';
import { baseDbModels } from '..';

// this will be the first collection created when a tenant creates a account.

const TenantHandshake = new Schema(
    {
        app: { type: Schema.Types.ObjectId, ref: MONGOOSE_MODELS.BASE_DB.APP },
    },
    {
        timestamps: true,
    },
);

export interface ITenantHandshake {
    app: string | baseDbModels.AppModel.IApp;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type ITenantHandshakeModel = Model<ITenantHandshake & Document>;

export const BaseModel: ITenantHandshakeModel = model(
    MONGOOSE_MODELS.TENANT_DB.TENANT_HANDSHAKE,
    TenantHandshake,
);
