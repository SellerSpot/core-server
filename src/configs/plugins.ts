import { IPlugin, EPLUGINS } from '@sellerspot/universal-types';

export const plugins: Partial<IPlugin>[] = [
    {
        pluginId: EPLUGINS[EPLUGINS.POINT_OF_SALE],
        name: 'Point of Sale',
        isVisibleInPluginMenu: true,
        isVisibleInPluginStore: true,
        dependantPlugins: [EPLUGINS[EPLUGINS.CATALOGUE]],
        icon: EPLUGINS[EPLUGINS.POINT_OF_SALE], // later it could be resolved with static image  url from s3
        image: '', // need to replace with aws s3 url - for now it directly handled in frontend
        bannerImages: [], // need to update from s3
        longDescription:
            'Day to day store sales with inventory control and bill generation and printing.', // need to update long description
        shortDescription:
            'Day to day store sales with inventory control and bill generation and printing.',
    },
    {
        pluginId: EPLUGINS[EPLUGINS.CATALOGUE],
        name: 'Catalogue',
        isVisibleInPluginMenu: true,
        isVisibleInPluginStore: false,
        dependantPlugins: [],
        icon: EPLUGINS[EPLUGINS.CATALOGUE], // later it could be resolved with static image  url from s3
        image: '', // need to replace with aws s3 url - for now it directly handled in frontend
        bannerImages: [], // need to update from s3
        longDescription: 'Atom for both pos and ecommerce', // need to update long description
        shortDescription: 'Atom for both pos and ecommerce',
    },
];
