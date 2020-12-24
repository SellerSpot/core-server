import { CONFIG } from 'config/index';
import { MONGOOSE_MODELS } from 'config/mongooseModels';
import { TenantModel } from 'models';
import { IResponse } from 'typings/request.types';

export const SignUpTenant = async (data: TenantModel.ITentat): Promise<IResponse> => {
    let response: IResponse = {
        status: true,
        statusCode: 200,
        data: true,
    };
    try {
        const db = global.currentDb.useDb(CONFIG.BASE_DB_NAME);
        const TenantModel: TenantModel.ITentatModel = db.model(MONGOOSE_MODELS.TENANT);
        const tenant = await TenantModel.create({
            ...data,
        });

        response.data = tenant;

        return Promise.resolve(response);
    } catch (error) {
        response = {
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'someting',
                    message: error.message,
                },
            ],
        };
        return Promise.reject(response);
    }
};

export const SignInTenant = (): Promise<IResponse> => {
    return Promise.resolve({
        status: true,
        statusCode: 200,
        data: true,
    });
};
