import { Connection } from 'mongoose';
import { MONGOOSE_MODELS, tenantDbModels } from '@sellerspot/database-models';

// subject to change (it is just a reference)
export const getBrandModel = (
    currentDb: Connection,
): tenantDbModels.pointOfSaleModels.BrandModel.IBrandModel => {
    return currentDb.model(MONGOOSE_MODELS.TENANT_DB.POINT_OF_SALE.BRAND);
};
