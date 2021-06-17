import { IPlugin } from '../../.yalc/@sellerspot/universal-types';

export const plugins: Partial<IPlugin>[] = [
    {
        name: 'Point of Sale',
        uniqueName: 'POINT_OF_SALE', // to identify the route in front end
        iconName: 'POINT_OF_SALE', // later it could be resolved with static image  url from s3
        image: '', // need to replace with aws s3 url - for now it directly handled in frontend
        bannerImages: [], // need to update from s3
        longDescription:
            'Day to day store sales with inventory control and bill generation and printing.', // need to update long description
        shortDescription:
            'Day to day store sales with inventory control and bill generation and printing.',
    },
];
