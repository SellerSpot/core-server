import { MONGOOSE_MODELS } from 'config/mongooseModels';
import { Schema, model, Model, Document } from 'mongoose';

const ReservedDomainSchema = new Schema(
    {
        name: String,
    },
    { timestamps: true },
);

export interface IReservedDomain {
    _id?: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export type IReservedDomainModel = Model<IReservedDomain & Document>;

export const ReservedDomainModel: IReservedDomainModel = model(
    MONGOOSE_MODELS.RESERVED_DOMAIN,
    ReservedDomainSchema,
);
