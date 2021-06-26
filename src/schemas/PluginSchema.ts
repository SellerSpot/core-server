import {
    IInstallPluginRequest,
    IGetPluginDetailByIdRequest,
    IUnInstallPluginRequest,
} from '@sellerspot/universal-types';
import joi from 'joi';

export class PluginSchema {
    static MONGOOSE_OBJECT_ID_LENGTH = 24;

    static installPluginSchema = joi.object<IInstallPluginRequest>({
        id: joi
            .string()
            .min(PluginSchema.MONGOOSE_OBJECT_ID_LENGTH)
            .max(PluginSchema.MONGOOSE_OBJECT_ID_LENGTH)
            .required(),
    });

    static unInstallPluginSchema = joi.object<IUnInstallPluginRequest>({
        id: joi
            .string()
            .min(PluginSchema.MONGOOSE_OBJECT_ID_LENGTH)
            .max(PluginSchema.MONGOOSE_OBJECT_ID_LENGTH)
            .required(),
    });

    static getPluginDetailByIdSchema = joi.object<IGetPluginDetailByIdRequest>({
        id: joi
            .string()
            .min(PluginSchema.MONGOOSE_OBJECT_ID_LENGTH)
            .max(PluginSchema.MONGOOSE_OBJECT_ID_LENGTH)
            .required(),
    });
}
