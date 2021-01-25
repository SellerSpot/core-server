import { baseDbModels } from '@sellerspot/database-models';
import { ISubDomainResponse, ITokenPayload } from './request.types';

export type TAuthResponse = ITokenPayload & {
    subDomain: ISubDomainResponse;
    apps: baseDbModels.AppModel.IApp[];
    token: string;
};
