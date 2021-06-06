import { coreDbServices, tenantDbServices } from '@sellerspot/database-models';

export default class TenantService {
    public static async deleteTenant(): Promise<boolean> {
        await coreDbServices.domain.deleteDomainsByTenantId();
        await coreDbServices.tenant.deleteTenant();
        await tenantDbServices.deleteTenantDb();
        return true;
    }
}
