import { MONGOOSE_MODELS } from 'config/mongooseModels';
import { ITenant } from 'models/Tenant';
import { ITenantHandshakeModel } from 'models/TenantHandshake';
import { IResponse } from 'typings/request.types';

export const setupTenant = async (
    tenantData: Pick<ITenant, 'name' | 'email'> & { id: string },
): Promise<IResponse> => {
    try {
        if (tenantData.id) {
            const db = global.currentDb.useDb(tenantData.id.toString()); // id comes and mongoose id to converted to  string
            const TentatHandshakeModel: ITenantHandshakeModel = db.model(
                MONGOOSE_MODELS.TENANT_HANDSHAKE,
            );
            const tenantHandshake = await TentatHandshakeModel.create({
                email: tenantData.email,
                name: tenantData.name,
                tenantId: tenantData.id,
            });
            return Promise.resolve({
                status: true,
                statusCode: 200,
                data: tenantHandshake,
            });
        } else {
            throw 'Something went wrong';
        }
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'tenantSetupFailure',
                    message: 'Something went wrong setting up tenant!',
                },
            ],
        } as IResponse);
    }
};
