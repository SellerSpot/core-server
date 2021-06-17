import {
    IInstallPluginRequest,
    IGetPluginDetailByIdRequest,
    IUnInstallPluginRequest,
} from '@sellerspot/universal-types';
import joi from 'joi';

export default class PluginSchema {
    static EXACT_MONGOOSE_OBJECT_ID_LENGTH = 24;

    static installPluginSchema = joi.object<IInstallPluginRequest>({
        id: joi.string().length(PluginSchema.EXACT_MONGOOSE_OBJECT_ID_LENGTH).required(),
    });

    static unInstallPluginSchema = joi.object<IUnInstallPluginRequest>({
        id: joi.string().length(PluginSchema.EXACT_MONGOOSE_OBJECT_ID_LENGTH).required(),
    });

    static getPluginDetailByIdSchema = joi.object<IGetPluginDetailByIdRequest>({
        id: joi.string().length(PluginSchema.EXACT_MONGOOSE_OBJECT_ID_LENGTH).required(),
    });
}
