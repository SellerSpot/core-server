import { MONGOOSE_MODELS } from 'config/mongooseModels';
import { Schema, model, Model, Document, Types } from 'mongoose';

const AppSchema = new Schema(
    {
        name: String,
        slug: String,
        shortDescription: String,
        longDescription: String,
        iconUrl: String,
        bannerImages: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true },
);

export interface IApp {
    _id?: string | Types.ObjectId;
    name?: string;
    slug?: string;
    shortDescription?: string;
    longDescription?: string;
    iconUrl?: string;
    bannerImages?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export type IAppModel = Model<IApp & Document>;

export const AppModel: IAppModel = model(MONGOOSE_MODELS.APP, AppSchema);
