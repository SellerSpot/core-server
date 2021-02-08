export type TErrorResponse = {
    name: string;
    message: string;
}[];

export interface IResponse {
    status: boolean;
    statusCode: number;
    data?: unknown | TErrorResponse;
}

export interface ITokenPayload {
    id: string;
    name: string;
    email: string;
}

export interface ISubDomainResponse {
    createdAt: string;
    domainName: string;
    tenant: string;
    updatedAt: string;
    _id: string;
    baseDomain: string;
}
