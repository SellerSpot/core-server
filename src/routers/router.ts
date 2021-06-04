import { IResponse, ROUTES, STATUS_CODE } from '@sellerspot/universal-types';
import { Router } from 'express';

const rootRouter = Router();

rootRouter.get(ROUTES.CORE.INFO, (_, res) => {
    res.status(STATUS_CODE.OK).send(<IResponse>{ status: true, data: 'Core server heartbeat' });
});

rootRouter.all('*', (_, res) => res.status(STATUS_CODE.NOT_FOUND));

export { rootRouter };
