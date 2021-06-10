import { middlewares } from '@sellerspot/universal-functions';
import { ROUTES } from '@sellerspot/universal-types';
import { DomainController } from 'controllers/controllers';
import { Router } from 'express';

const router = Router();

router.put(ROUTES.CORE.UPDATE_DOMAIN, middlewares.auth, DomainController.updateDomain);

export default router;
