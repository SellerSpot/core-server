import { MONGOOSE_MODELS } from 'models/mongooseModels';
import { Schema, model, Model, Document } from 'mongoose';

const DetailSchema = new Schema(
    {
        app: { type: Schema.Types.ObjectId, ref: MONGOOSE_MODELS.BASE_DB.APP },
        // we could add some additional properties later.
    },
    { timestamps: true },
);

export interface IDetail {
    app: string;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type IDetailModel = Model<IDetail & Document>;

export const DetailModel: IDetailModel = model(
    MONGOOSE_MODELS.POINT_OF_SALE_DB.DETAIL,
    DetailSchema,
);
