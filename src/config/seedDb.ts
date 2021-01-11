import { appController, reservedDomainController } from 'controllers';
import { IApp } from 'models/App';
import { IReservedDomain } from 'models/ReservedDomain';
import { logger } from 'utilities/logger';

export const seedAppCollection = async (): Promise<void> => {
    try {
        logger('mongoose', 'Seeding App collection with default apps.');
        const apps: IApp[] = [
            {
                name: 'Point of Sale',
                iconUrl: 'CASH_REGISTER', // need to use s3 bucket to store images and urls should be shared here
                shortDescription: 'Advanced Billing and Inventory Management Application.',
                longDescription:
                    'Advanced Billing and Inventory Management Application. Features Includes, Cash Register, Inventory management, user management, customer foucsed chekcout flow and so on.',
                bannerImages: [
                    'https://i.pinimg.com/originals/96/10/49/96104952e6b027204946fd9eb0361436.jpg',
                    'https://cdn.dribbble.com/users/2085056/screenshots/6559902/untill_shot1-2_4x.png?compress=1&resize=400x300',
                    'https://images.ctfassets.net/2d5q1td6cyxq/6yg3hIlsKoloiGpiwTqcih/39044a394afef4493e5f1c2edb9fd791/PD01142_-_US_dashboard_social.png?w=1200&h=630&fm=jpg&q=90&fit=thumb',
                ],
                domainName: 'pos',
            },
        ];
        apps.map(async (app) => {
            try {
                await appController.adminCreateNewApp(app);
            } catch (error) {
                logger('mongoose', `Seed App ${app.name} already in collection.`);
            }
        });
        logger('mongoose', 'seeing app collection done.');
    } catch (error) {}
};

export const reservedDomainCollection = async (): Promise<void> => {
    try {
        logger('mongoose', 'Seeding Reserved domain collection.');
        const reservedDomains: IReservedDomain[] = [
            {
                name: 'admin',
            },
            {
                name: 'administrator',
            },
            {
                name: 'administration',
            },
            {
                name: 'administration',
            },
            {
                name: 'sellerspot',
            },
            {
                name: 'com',
            },
            {
                name: 'org',
            },
            {
                name: 'ecommerce',
            },
            {
                name: 'ecom',
            },
            {
                name: 'pos',
            },
            {
                name: 'pointofsale',
            },
            {
                name: 'dashboard',
            },
            {
                name: 'control',
            },
            {
                name: 'hack',
            },
            {
                name: 'panel',
            },
            {
                name: 'dashboard',
            },
            {
                name: 'dash',
            },
            {
                name: 'host',
            },
            {
                name: 'localhost',
            },
            {
                name: 'root',
            },
        ];
        reservedDomains.map(async (reserveDomain) => {
            try {
                await reservedDomainController.adminAddNewReservedDomain(reserveDomain);
            } catch (error) {
                logger(
                    'mongoose',
                    `Seed reserved domain ${reserveDomain.name} already in collection.`,
                );
            }
        });
        logger('mongoose', 'seeing reserved domain collection done.');
    } catch (error) {}
};
