import { ROUTES } from '@sellerspot/universal-types';
import { PluginController } from 'controllers/controllers';
import { Router } from 'express';
import { PluginSchema } from 'schemas/schemas';
import { middlewares } from '@sellerspot/universal-functions';

const router = Router();

router.get(ROUTES.CORE.PLUGIN.GET_ALL_PLUGINS, PluginController.getAllPlugins);

router.post(
    ROUTES.CORE.PLUGIN.INSTALL_PLUGIN,
    middlewares.auth,
    middlewares.validateSchema({ pathParamSchema: PluginSchema.installPluginSchema }),
    PluginController.installPlugin,
);

router.delete(
    ROUTES.CORE.PLUGIN.UNINSTALL_PLUGIN,
    middlewares.auth,
    middlewares.validateSchema({ pathParamSchema: PluginSchema.unInstallPluginSchema }),
    PluginController.unInstallPlugin,
);

router.get(
    ROUTES.CORE.PLUGIN.GET_PLUGIN_DETAILS_BY_ID,
    middlewares.validateSchema({ pathParamSchema: PluginSchema.getPluginDetailByIdSchema }),
    PluginController.getPluginDetailsById,
);

export default router;
