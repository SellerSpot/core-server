import { CONFIG } from 'config/config';
import { MONGOOSE_MODELS, baseDbModels, DB_NAMES } from '@sellerspot/database-models';
import { IResponse, ITokenPayload } from 'typings/request.types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { tenantController } from 'controllers/controllers';
import { TAuthResponse } from 'typings/response.types';

export const SignUpTenant = async (data: baseDbModels.TenantModel.ITenant): Promise<IResponse> => {
    const response: IResponse = {
        status: false,
        statusCode: 400,
        data: null,
    };
    try {
        const { email, name, password } = data;
        if (!(email && name && password)) throw 'Invalid Data';
        const baseDb = global.currentDb.useDb(DB_NAMES.BASE_DB);
        const TenantModel: baseDbModels.TenantModel.ITenantModel = baseDb.model(
            MONGOOSE_MODELS.BASE_DB.TENANT,
        );
        if (!(await TenantModel.findOne({ email }))) {
            const tenant = await TenantModel.create({
                email,
                name,
                password: bcrypt.hashSync(password, 8),
            });
            response.status = true;
            response.statusCode = 200;
            const payload: ITokenPayload = {
                id: tenant._id,
                name: tenant.name,
                email: tenant.email,
            };
            // setting up tenant baseDb for data isolation for the apps per tenant
            setTimeout(() => {
                // running asynchrously - if control over configuration is needed -  tenantController.setupTenant return a promise await and listen for response, response will be the type of IResponse
                tenantController.setupTenant(payload);
            });

            response.data = <TAuthResponse>{
                ...payload,
                subDomain: {
                    _id: '',
                    baseDomain: CONFIG.CLIENT_BASE_DOMAIN_FOR_APPS,
                    createdAt: '',
                    domainName: '',
                    tenantId: tenant._id,
                    updatedAt: '',
                },
                apps: [], // there won't be no apps installed on signUp
                token: jwt.sign(payload, CONFIG.APP_SECRET, {
                    expiresIn: '2 days', // check zeit/ms
                }),
            };
            return Promise.resolve(response);
        } else {
            throw `Account with the email id already exist!, please login with your email id and password`;
        }
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'alreadyFound',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};

export const SignInTenant = async (
    data: Pick<baseDbModels.TenantModel.ITenant, 'email' | 'password'>,
): Promise<IResponse> => {
    const response: IResponse = {
        status: false,
        statusCode: 400,
        data: null,
    };
    try {
        const { email, password } = data;
        const baseDb = global.currentDb.useDb(DB_NAMES.BASE_DB);
        const TenantModel: baseDbModels.TenantModel.ITenantModel = baseDb.model(
            MONGOOSE_MODELS.BASE_DB.TENANT,
        );
        const tenant = await TenantModel.findOne({ email })
            .populate('subDomain', null, MONGOOSE_MODELS.BASE_DB.SUB_DOMAIN)
            .populate('apps', null, MONGOOSE_MODELS.BASE_DB.APP);
        if (!tenant) throw `We couldn't find the account!, please check Your Email Id!`;
        if (bcrypt.compareSync(password, tenant.password)) {
            response.status = true;
            response.statusCode = 200;
            const payload: ITokenPayload = {
                id: tenant._id,
                name: tenant.name,
                email: tenant.email,
            };
            const subDomainDetails = <baseDbModels.SubDomainModel.ISubDomain>tenant.subDomain ?? {
                domainName: '',
                tenantId: tenant._id,
                _id: '',
                createdAt: '',
                updatedAt: '',
            };
            response.data = <TAuthResponse>{
                ...payload,
                subDomain: {
                    ...(<baseDbModels.SubDomainModel.ISubDomain>{
                        _id: subDomainDetails._id,
                        domainName: subDomainDetails.domainName,
                        tenantId: subDomainDetails.tenantId,
                        createdAt: subDomainDetails.createdAt,
                        updatedAt: subDomainDetails.updatedAt,
                    }),
                    baseDomain: CONFIG.CLIENT_BASE_DOMAIN_FOR_APPS,
                },
                apps: tenant.apps,
                token: jwt.sign(payload, CONFIG.APP_SECRET, {
                    expiresIn: '2 days', // check zeit/ms
                }),
            };
            return Promise.resolve(response);
        } else {
            throw `Your Password is Incorrect!`;
        }
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'notFound',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};

export const verifyToken = async (socket: Socket): Promise<IResponse> => {
    try {
        const { token }: { token: string } = socket.handshake.auth as { token: string };
        if (!token) {
            throw 'tokenNotFound';
        }
        const response: IResponse = await new Promise((resolve, reject) =>
            jwt.verify(token, CONFIG.APP_SECRET, (err, decoded: ITokenPayload) => {
                if (err) {
                    reject('tokenExpired');
                }
                // on verificaiton success
                resolve({
                    status: true,
                    statusCode: 200,
                    data: decoded,
                } as IResponse);
            }),
        );
        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 401, // unauthorized
            data: [
                {
                    name: error,
                    message:
                        'Auth token expired or not found! ReAuthenticate to refresh the token.',
                },
            ],
        } as IResponse);
    }
};
