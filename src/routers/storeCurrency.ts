import { Router } from 'express';
import { ROUTES } from '@sellerspot/universal-types';
import { middlewares } from '@sellerspot/universal-functions';

import { StoreCurrencySchema } from 'schemas/schemas';
import { StoreCurrencyController } from 'controllers/controllers';

const router = Router();

router.get(ROUTES.CORE.STORE_CURRENCY.GET_ALL, StoreCurrencyController.getAllCurrencies);

router.put(
    ROUTES.CORE.STORE_CURRENCY.UPDATE,
    middlewares.auth,
    middlewares.validateSchema({ bodySchema: StoreCurrencySchema.updateStoreCurrencySchema }),
    StoreCurrencyController.updateStoreCurrency,
);

export default router;
