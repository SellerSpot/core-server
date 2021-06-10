import { AuthUtil } from '@sellerspot/universal-functions';
import { JWTManager } from '@sellerspot/universal-functions';
import {
    IDomainDetails,
    IDomainUpdateRequest,
    IDomainUpdateResponse,
    STATUS_CODE,
} from '@sellerspot/universal-types';
import { CONFIG } from 'configs/config';
import { CookieOptions, Request, RequestHandler, Response } from 'express';
import { DomainService } from 'services/services';

export default class DomainController {
    static updateDomain: RequestHandler = async (req, res) => {
        const { domain: domainName } = <IDomainUpdateRequest>req.body;
        const domainDetails = await DomainService.updateDomain(domainName);
        DomainController.refreshTokenWithNewDomain(req, res, domainDetails);
        const response = <IDomainUpdateResponse>{
            status: true,
            data: {
                domainDetails,
            },
        };
        res.status(STATUS_CODE.OK).send(response);
    };

    /**
     * removes the cookie from oldDomains token and updates the cookie with new domain
     *
     * @param res - res object of the current request
     * @param currentDomainName - updateDomain string
     * @param oldDomainName - old domain string - we could get it from currentTenant in request object throught auth middleware
     *
     * @returns void
     */
    private static refreshTokenWithNewDomain = (
        req: Request,
        res: Response,
        currentDomainDetails: IDomainDetails,
    ): void => {
        // remove the oldCookie with olddomain
        const removeCookieOption: CookieOptions = {
            httpOnly: false,
            secure: CONFIG.ENV === 'production' ? true : false,
            sameSite: 'lax',
            domain: CONFIG.DOMAIN,
            maxAge: 0,
            path: '/',
        };
        const { domainName: currentDomainName } = req.currentUser;
        res.cookie(currentDomainName, null, removeCookieOption);

        // sets new cookie with current domain
        const { domainName } = currentDomainDetails;
        const tenantId = AuthUtil.getCurrentTenantId();
        const userId = AuthUtil.getCurrentUserId();
        const tenantJwt = JWTManager.createToken({
            tenantId,
            domainName,
            userId,
        });
        const updateCookieOption: CookieOptions = {
            httpOnly: false,
            secure: true,
            sameSite: 'none',
            domain: CONFIG.DOMAIN,
            path: '/',
        };
        res.cookie(domainName, tenantJwt, updateCookieOption);
    };
}
