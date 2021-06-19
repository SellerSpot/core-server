import { middlewares } from '@sellerspot/universal-functions';
import { ROUTES } from '@sellerspot/universal-types';
import { DomainController } from 'controllers/controllers';
import { Router } from 'express';
import { DomainSchema } from 'schemas/schemas';

const router = Router();

router.put(
    ROUTES.CORE.DOMAIN.UPDATE_DOMAIN,
    middlewares.auth,
    middlewares.validateSchema({ bodySchema: DomainSchema.udpateDomainSchema }),
    DomainController.updateDomain,
);

export default router;
