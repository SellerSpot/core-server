import { plugins } from 'configs/plugins';
import { coreDbServices } from '@sellerspot/database-models';
import { IPlugin, IInstalledPlugin, ERROR_CODE } from '@sellerspot/universal-types';
import { BadRequestError, logger } from '../../.yalc/@sellerspot/universal-functions/dist';

export default class PluginService {
    static seedPlugins = async (): Promise<void> => {
        plugins.map(async (plugin) => {
            try {
                await coreDbServices.plugin.createPlugin(<IPlugin>plugin);
            } catch (error) {
                logger.error(error?.message);
            }
        });
    };

    static getAllPlugins = async (): Promise<IPlugin[]> => {
        const plugins = await coreDbServices.plugin.getAllPlugins();
        return plugins as IPlugin[];
    };

    static installPlugin = async (
        tenantId: string,
        pluginId: string,
    ): Promise<IInstalledPlugin[]> => {
        const installedPlugins = await coreDbServices.tenant.addPlugin(pluginId, tenantId);
        const plugins = installedPlugins.map(
            (installedPlugin) =>
                <IInstalledPlugin>{
                    plugin: installedPlugin.plugin,
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
                    plugin: installedPlugin.plugin,
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
        return {
            pluginId: plugin.pluginId,
            name: plugin.name,
            icon: plugin.icon,
            dependantPlugins: <string[]>plugin.dependantPlugins,
            isVisibleInPluginMenu: plugin.isVisibleInPluginMenu,
            isVisibleInPluginStore: plugin.isVisibleInPluginStore,
            image: plugin.image,
            bannerImages: plugin.bannerImages,
            shortDescription: plugin.shortDescription,
            longDescription: plugin.longDescription,
        };
    };
}
