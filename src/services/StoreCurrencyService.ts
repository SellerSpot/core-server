import { coreDbServices } from '../../.yalc/@sellerspot/database-models/dist';
import { logger } from '../../.yalc/@sellerspot/universal-functions/dist';

export class StoreCurrencyService {
    static seedStoreCurrencies = async (): Promise<void> => {
        const { seedStoreCurrencies } = coreDbServices.storeCurrency;
        try {
            await seedStoreCurrencies();
            logger.info('Store currencies seeded successfully');
        } catch (error) {
            logger.error(error?.message);
        }
    };
}
