import { plugins } from 'configs/plugins';
import { coreDbServices } from '@sellerspot/database-models';
import { IPlugin, IInstalledPlugin } from '@sellerspot/universal-types';

export default class PluginService {
    static seedPlugins = async (): Promise<void> => {
        plugins.map(async (plugin) => {
            try {
                await coreDbServices.plugin.createPlugin(<IPlugin>plugin);
            } catch (error) {}
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
        const installedPlugins = await coreDbServices.tenant.addPlugin(tenantId, pluginId);
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
}
