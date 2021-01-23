import { IApp } from 'models/baseDb/App';
import { ISubDomainResponse, ITokenPayload } from './request.types';

export type TAuthResponse = ITokenPayload & {
    subDomain: ISubDomainResponse;
    apps: IApp[];
    token: string;
};
