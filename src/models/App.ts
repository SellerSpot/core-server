import { MONGOOSE_MODELS } from 'config/mongooseModels';
import { Schema, model, Model, Document } from 'mongoose';

const AppSchema = new Schema(
    {
        name: String,
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
    _id?: string;
    name?: string;
    shortDescription?: string;
    longDescription?: string;
    iconUrl?: string;
    bannerImages?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export type IAppModel = Model<IApp & Document>;

export const AppModel: IAppModel = model(MONGOOSE_MODELS.APP, AppSchema);
