import { coreDbModels, coreDbServices } from '@sellerspot/database-models';
import { IPlugin, IInstalledPlugin, ERROR_CODE } from '@sellerspot/universal-types';
import { BadRequestError, logger } from '@sellerspot/universal-functions';
import { LeanDocument } from 'mongoose';

export class PluginService {
    static seedPlugins = async (): Promise<void> => {
        const { seedPlugins } = coreDbServices.plugin;
        try {
            await seedPlugins();
            logger.info('Plugins seeded successfully');
        } catch (error) {
            logger.error(error?.message);
        }
    };

    static getAllPlugins = async (): Promise<IPlugin[]> => {
        const plugins = await coreDbServices.plugin.getAllPlugins();
        return plugins.map((plugin) => PluginService.getStructuredPlugin(plugin)) as IPlugin[];
    };

    static installPlugin = async (
        tenantId: string,
        pluginId: string,
    ): Promise<IInstalledPlugin[]> => {
        const installedPlugins = await coreDbServices.tenant.addPlugin(pluginId, tenantId);
        const plugins = installedPlugins.map(
            (installedPlugin) =>
                <IInstalledPlugin>{
                    plugin: PluginService.getStructuredPlugin(
                        installedPlugin.plugin as coreDbModels.IPlugin,
                    ),
                    createdAt: installedPlugin.createdAt,
                    updatedAt: installedPlugin.updatedAt,
                },
        );

        return plugins;
    };

    static unInstallPlugin = async (
        tenantId: string,
        pluginId: string,
    ): Promise<IInstalledPlugin[]> => {
        const installedPlugins = await coreDbServices.tenant.removePlugin(pluginId, tenantId);
        const plugins = installedPlugins.map(
            (installedPlugin) =>
                <IInstalledPlugin>{
                    plugin: PluginService.getStructuredPlugin(
                        installedPlugin.plugin as coreDbModels.IPlugin,
                    ),
                    createdAt: installedPlugin.createdAt,
                    updatedAt: installedPlugin.updatedAt,
                },
        );

        return plugins;
    };

    static getPluginDetailsById = async (pluginId: string): Promise<IPlugin> => {
        const plugin = await coreDbServices.plugin.getPluginById(pluginId);
        if (!plugin) {
            logger.error(`Invalid plugin id requested ${pluginId}`);
            throw new BadRequestError(ERROR_CODE.PLUGIN_INVALID, 'Please provide valid plugin id');
        }
        return PluginService.getStructuredPlugin(plugin);
    };

    static getStructuredPlugin = (plugin: LeanDocument<coreDbModels.IPluginDoc>): IPlugin => ({
        id: plugin._id,
        uniqueName: plugin.uniqueName,
        name: plugin.name,
        icon: plugin.icon,
        dependantPlugins: <string[]>plugin.dependantPlugins,
        isVisibleInPluginMenu: plugin.isVisibleInPluginMenu,
        isVisibleInPluginStore: plugin.isVisibleInPluginStore,
        image: plugin.image,
        bannerImages: plugin.bannerImages,
        shortDescription: plugin.shortDescription,
        longDescription: plugin.longDescription,
    });
}
