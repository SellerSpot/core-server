import { STATUS_CODE } from '@sellerspot/universal-types';
import { RequestHandler } from 'express';
import { TenantService } from 'services/services';

export default class TenantController {
    static deleteTenant: RequestHandler = async (_, res) => {
        const deleteAccountStatus = await TenantService.deleteTenant();
        if (deleteAccountStatus) {
            res.status(STATUS_CODE.OK).send({ status: true });
        } else {
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send({ status: false });
        }
    };
}
