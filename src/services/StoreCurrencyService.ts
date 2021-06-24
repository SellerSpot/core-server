import { coreDbServices } from '@sellerspot/database-models';
import { logger } from '@sellerspot/universal-functions';
import { IStoreCurrency } from '@sellerspot/universal-types';

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

    static getAllStoreCurrencies = async (): Promise<IStoreCurrency[]> => {
        const currencies = await coreDbServices.storeCurrency.getAllStoreCurrencies();
        return currencies.map(
            (currency) =>
                <IStoreCurrency>{
                    id: currency._id,
                    code: currency.code,
                    name: currency.name,
                    symbol: currency.symbol,
                },
        );
    };

    static updateStoreCurrency = async (
        tenantId: string,
        currencyId: string,
    ): Promise<IStoreCurrency> => {
        const updatedCurrency = await coreDbServices.tenant.updateStoreCurrencyById(
            tenantId,
            currencyId,
        );
        return <IStoreCurrency>{
            id: updatedCurrency._id,
            code: updatedCurrency.code,
            name: updatedCurrency.name,
            symbol: updatedCurrency.symbol,
        };
    };
}
