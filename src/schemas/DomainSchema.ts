import {
    ICheckDomainAvailablityRequestQuery,
    TJoiErrorMessages,
} from '@sellerspot/universal-types';
import joi from 'joi';

export default class DomainSchema {
    private static domainLength = {
        max: 3,
        min: 15,
    };
    static udpateDomainSchema = joi.object<ICheckDomainAvailablityRequestQuery>({
        domain: joi
            .string()
            .min(DomainSchema.domainLength.min)
            .max(DomainSchema.domainLength.max)
            .required()
            .messages(<TJoiErrorMessages>{
                'any.required': 'Domain required',
                'string.base': 'Domain required',
                'string.empty': 'Domain required',
                'string.max': `Domain name should be less than or equal to ${DomainSchema.domainLength.max} characters long`,
                'string.min': `Domain name should be greater than or equal to ${DomainSchema.domainLength.min} characters long`,
            }),
    });
}