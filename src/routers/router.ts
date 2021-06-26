import { IResponse, ROUTES, STATUS_CODE } from '@sellerspot/universal-types';
import { Router } from 'express';
import tenantRouter from './tenant';
import domainRouter from './domain';
import pluginRouter from './plugin';
import storeCurrencyRouter from './storeCurrency';

const rootRouter = Router();

rootRouter.use('/', tenantRouter);

rootRouter.use('/', domainRouter);

rootRouter.use('/', pluginRouter);

rootRouter.use('/', storeCurrencyRouter);

rootRouter.get(ROUTES.CORE.INFO, (_, res) => {
    res.status(STATUS_CODE.OK).send(<IResponse>{ status: true, data: 'Core server heartbeat' });
});

rootRouter.all('*', (_, res) => res.status(STATUS_CODE.NOT_FOUND));

export { rootRouter };
