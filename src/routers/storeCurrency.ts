import { ROUTES } from '@sellerspot/universal-types';
import { StoreCurrencyController } from 'controllers/controllers';
import { Router } from 'express';

const router = Router();

router.get(ROUTES.CORE.STORE_CURRENCY.GET_ALL, StoreCurrencyController.getAllCurrencies);

export default router;
