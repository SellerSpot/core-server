import { CONFIG } from 'config/config';
import { MONGOOSE_MODELS } from 'config/mongooseModels';
import { ITenant } from 'models/Tenant';
import { ITenantHandshakeModel } from 'models/TenantHandshake';
import { IResponse } from 'typings/request.types';

/**
 * onboards a tenant with name and email
 */
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

/**
 * deletes a tenant
 * todo - need to delete the subdomain of the particular tenant
 */
export const deleteTenant = async ({ tenantId }: { tenantId: string }): Promise<IResponse> => {
    try {
        if (!tenantId) throw 'Something went wrong';
        const baseDb = global.currentDb.useDb(CONFIG.BASE_DB_NAME);
        const TenantModel = baseDb.model(MONGOOSE_MODELS.TENANT);
        const tenant = await TenantModel.findById(tenantId);
        if (!tenant) throw 'Tenant Not Found';
        await tenant.delete();

        global.currentDb.useDb(null); // fail safe - not to delete base db

        // deletes tenant db
        const tenantDb = global.currentDb.useDb(tenantId.toString()); // id comes and mongoose id to converted to  string
        await tenantDb.dropDatabase();

        return Promise.resolve({
            status: true,
            statusCode: 200,
            data: 'Successfully deleted Tenant database',
        });
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'tenantDeleteFailure',
                    message: 'Something went wrong deleting tenant!',
                },
            ],
        } as IResponse);
    }
};