import { coreDbModels, coreDbServices } from '@sellerspot/database-models';
import { AuthUtil } from '@sellerspot/universal-functions';
import { IDomainDetails } from '@sellerspot/universal-types';
import { CONFIG } from 'configs/config';
import { LeanDocument } from 'mongoose';

type IDomain = LeanDocument<coreDbModels.IDomain>;

export class DomainService {
    static updateDomain = async (newDomain: string): Promise<IDomainDetails> => {
        const tenantId = AuthUtil.getCurrentTenantId();
        const domainDoc: IDomain = await coreDbServices.domain.udpateDomainByTenantId(
            tenantId,
            newDomain,
        );
        return DomainService.getDomainDetails(domainDoc);
    };

    private static getDomainDetails = (domain: IDomain): IDomainDetails => {
        const protocol = 'https'; // paid feature
        const appDomain = 'app'; // second level subdomain for dashboard
        const domainDetails: IDomainDetails = {
            domainName: domain.name,
            name: domain.name,
            isCustomDomain: domain.isCustom,
            url: '',
        };
        if (!domainDetails.isCustomDomain) {
            domainDetails.domainName = `${appDomain}.${domain.name}.${CONFIG.DOMAIN}`;
        }
        // prepare url
        if (CONFIG.ENV === 'development') {
            domainDetails.url = `${protocol}://${domainDetails.domainName}:${CONFIG.CORE_APP_DEV_PORT}`;
        } else {
            domainDetails.url = `${protocol}://${domainDetails.domainName}`;
        }
        return domainDetails;
    };
}
