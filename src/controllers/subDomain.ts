import { CONFIG } from 'config/config';
import { IResponse, ISubDomainResponse } from 'typings/request.types';
import { DB_NAMES, MONGOOSE_MODELS, baseDbModels } from '@sellerspot/database-models';
import { string } from 'joi';

export const createSubDomain = async (data: {
    domainName: string;
    tenantId: string;
}): Promise<IResponse> => {
    try {
        if (!data.tenantId) throw 'Invalid data';
        if (data.domainName && (data.domainName.length < 3 || data.domainName.length > 15))
            throw 'domain name length exceeded, domain name should be minimum of 3 and maximum of 10 characters';

        const baseDb = global.currentDb.useDb(DB_NAMES.BASE_DB); // id comes and mongoose id to converted to  string
        const TenantModel: baseDbModels.TenantModel.ITenantModel = baseDb.model(
            MONGOOSE_MODELS.BASE_DB.TENANT,
        );
        const tenant = await TenantModel.findById(data.tenantId);
        if (!tenant) throw 'Invalid Tenant';

        const SubDomainModel: baseDbModels.SubDomainModel.ISubDomainModel = baseDb.model(
            MONGOOSE_MODELS.BASE_DB.SUB_DOMAIN,
        );
        if ((await SubDomainModel.find({ domainName: data.domainName })).length)
            throw 'Domain Not Available! Try alternate domain!';

        const ReservedDomainModel: baseDbModels.ReservedDomainModel.IReservedDomainModel = baseDb.model(
            MONGOOSE_MODELS.BASE_DB.RESERVED_DOMAIN,
        );
        if ((await ReservedDomainModel.find({ name: data.domainName })).length)
            throw 'Domain Not Available! Try alternate domain!';

        const sanitizedDomainName = data.domainName
            .replace(/[^a-zA-Z]+/g, '')
            .trim()
            .toLowerCase();

        const subDomain = await SubDomainModel.create({
            domainName: sanitizedDomainName,
            tenant: data.tenantId,
        });
        tenant.subDomain = subDomain.id;
        await tenant.save();

        return Promise.resolve({
            status: true,
            statusCode: 200,
            data: {
                _id: subDomain.id,
                baseDomain: CONFIG.CLIENT_BASE_DOMAIN_FOR_APPS,
                createdAt: subDomain.createdAt,
                updatedAt: subDomain.updatedAt,
                domainName: subDomain.domainName,
                tenant: subDomain.tenant,
            } as ISubDomainResponse,
        });
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'subDomainCreationFailure',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};

export const updateSubDomain = async (data: {
    domainName: string;
    tenantId: string;
}): Promise<IResponse> => {
    try {
        if (!data.tenantId) throw 'Invalid data';
        if (data.domainName && (data.domainName.length < 3 || data.domainName.length > 15))
            throw 'domain name length exceeded, domain name should be minimum of 3 and maximum of 10 characters';

        const baseDb = global.currentDb.useDb(DB_NAMES.BASE_DB); // id comes and mongoose id to converted to  string
        const TenantModel: baseDbModels.TenantModel.ITenantModel = baseDb.model(
            MONGOOSE_MODELS.BASE_DB.TENANT,
        );
        const tenant = await TenantModel.findById(data.tenantId);
        if (!tenant) throw 'Invalid Tenant';

        const SubDomainModel: baseDbModels.SubDomainModel.ISubDomainModel = baseDb.model(
            MONGOOSE_MODELS.BASE_DB.SUB_DOMAIN,
        );
        const subDomain = await SubDomainModel.findById(tenant.subDomain);
        if (!subDomain) throw 'Invalid domain';

        if ((await SubDomainModel.find({ domainName: data.domainName })).length)
            throw 'Domain Not Available! Try alternate domain!';

        const ReservedDomainModel: baseDbModels.ReservedDomainModel.IReservedDomainModel = baseDb.model(
            MONGOOSE_MODELS.BASE_DB.RESERVED_DOMAIN,
        );
        if ((await ReservedDomainModel.find({ name: data.domainName })).length)
            throw 'Domain Not Available! Try alternate domain!';

        await deleteSubDomain({ tenantId: data.tenantId });

        const createSubDomainResponse = await createSubDomain({
            domainName: data.domainName,
            tenantId: data.tenantId,
        });

        return {
            status: true,
            statusCode: 200,
            data: createSubDomainResponse.data as ISubDomainResponse,
        };
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'subdomainUpdationFailure',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};

export const deleteSubDomain = async (data: { tenantId: string }): Promise<IResponse> => {
    try {
        if (!data.tenantId) throw 'Invalid data';
        const baseDb = global.currentDb.useDb(DB_NAMES.BASE_DB); // id comes and mongoose id to converted to  string
        const TenantModel: baseDbModels.TenantModel.ITenantModel = baseDb.model(
            MONGOOSE_MODELS.BASE_DB.TENANT,
        );
        const tenant = await TenantModel.findById(data.tenantId);
        if (!tenant) throw 'Invalid Tenant';
        if (!tenant.subDomain) throw 'Tenant has no subdomain yet';

        const SubDomainModel: baseDbModels.SubDomainModel.ISubDomainModel = baseDb.model(
            MONGOOSE_MODELS.BASE_DB.SUB_DOMAIN,
        );
        const subDomain = await SubDomainModel.findById(tenant.subDomain);
        if (!subDomain) throw 'Invalid domain';
        await subDomain.delete();
        tenant.subDomain = null;
        await tenant.save();
        return Promise.resolve({
            status: true,
            statusCode: 200,
            data: 'Domain deleted Successfully',
        });
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'subDomainDeletionFailure',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};

export const checkSubDomainAvailability = async (domainName: string): Promise<IResponse> => {
    try {
        const baseDb = global.currentDb.useDb(DB_NAMES.BASE_DB); // id comes and mongoose id to converted to  string
        const SubDomainModel: baseDbModels.SubDomainModel.ISubDomainModel = baseDb.model(
            MONGOOSE_MODELS.BASE_DB.SUB_DOMAIN,
        );
        const ReservedDomainModel: baseDbModels.ReservedDomainModel.IReservedDomainModel = baseDb.model(
            MONGOOSE_MODELS.BASE_DB.RESERVED_DOMAIN,
        );
        const isAvailable =
            domainName.length >= 3 &&
            domainName.length <= 15 &&
            (await SubDomainModel.find({ domainName: domainName })).length === 0 &&
            (await ReservedDomainModel.find({ name: domainName })).length === 0;
        // domian suggestion can be given here in future iteration
        return Promise.resolve({
            status: true,
            statusCode: 200,
            data: {
                available: isAvailable,
            },
        });
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'subDomainCheckAvailabilityFailure',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};
