import { IUpdateStoreCurrencyRequest } from '@sellerspot/universal-types';
import joi from 'joi';
import { PluginSchema } from './PluginSchema';

export class StoreCurrencySchema {
    static updateStoreCurrencySchema = joi.object<IUpdateStoreCurrencyRequest>({
        currencyId: joi
            .string()
            .min(PluginSchema.MONGOOSE_OBJECT_ID_LENGTH)
            .max(PluginSchema.MONGOOSE_OBJECT_ID_LENGTH)
            .required(),
    });
}
