import { CONFIG } from 'config/index';
import { MONGOOSE_MODELS } from 'config/mongooseModels';
import { TenantModel } from 'models';
import { IResponse, ITokenPayload } from 'typings/request.types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const SignUpTenant = async (data: TenantModel.ITentat): Promise<IResponse> => {
    const response: IResponse = {
        status: false,
        statusCode: 400,
        data: null,
    };
    try {
        const { email, name, password } = data;
        const db = global.currentDb.useDb(CONFIG.BASE_DB_NAME);
        const TenantModel: TenantModel.ITentatModel = db.model(MONGOOSE_MODELS.TENANT);
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
            response.data = {
                ...payload,
                token: jwt.sign(payload, CONFIG.JWT_SECRET, {
                    expiresIn: '2 days', // check zeit/ms
                }),
            };
            return Promise.resolve(response);
        } else {
            response.data = [
                {
                    name: `alreadyFound`,
                    messaeg: `Account with the email id already exist!, please login with your email and password`,
                },
            ];
            throw response;
        }
    } catch (error) {
        return Promise.reject(response);
    }
};

export const SignInTenant = async (
    data: Pick<TenantModel.ITentat, 'email' | 'password'>,
): Promise<IResponse> => {
    const response: IResponse = {
        status: false,
        statusCode: 400,
        data: null,
    };
    try {
        const { email, password } = data;
        const db = global.currentDb.useDb(CONFIG.BASE_DB_NAME);
        const TenantModel: TenantModel.ITentatModel = db.model(MONGOOSE_MODELS.TENANT);
        const tenant = await TenantModel.findOne({ email });
        if (bcrypt.compareSync(password, tenant.password)) {
            response.status = true;
            response.statusCode = 200;
            const payload: ITokenPayload = {
                id: tenant._id,
                name: tenant.name,
                email: tenant.email,
            };
            response.data = {
                ...payload,
                token: jwt.sign(payload, CONFIG.JWT_SECRET, {
                    expiresIn: '2 days', // check zeit/ms
                }),
            };
            return Promise.resolve(response);
        } else {
            response.data = [
                {
                    name: `notFound`,
                    messaeg: `We couldn't find the account!, please check the email or passowrd!`,
                },
            ];
            throw response;
        }
    } catch (error) {
        return Promise.reject(response);
    }
};
