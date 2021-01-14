import { MONGOOSE_MODELS } from 'config/mongooseModels';
import { Schema, model, Model, Document } from 'mongoose';

const SubDomainSchema = new Schema(
    {
        domainName: String,
        tenantId: { type: Schema.Types.ObjectId, ref: MONGOOSE_MODELS.TENANT },
    },
    { timestamps: true },
);

export interface ISubDomain {
    domainName: string;
    tenantId: string;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type ISubDomainModel = Model<ISubDomain & Document>;

export const SubDomainModel: ISubDomainModel = model(MONGOOSE_MODELS.SUB_DOMAIN, SubDomainSchema);