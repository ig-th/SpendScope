import { Currency, Category, Language } from '../types';
import { CURRENCY_DECIMALS } from '../constants';
import { TRANSLATIONS } from './translations';

export const getCurrencySymbol = (curr: Currency): string => {
  switch (curr) {
    case Currency.TWD: return 'NT$';
    case Currency.USD: return 'US$';
    case Currency.JPY: return '¥';
    case Currency.EUR: return '€';
    case Currency.GBP: return '£';
    case Currency.KRW: return '₩';
    case Currency.CNY: return '¥';
    case Currency.THB: return '฿';
    case Currency.VND: return '₫';
    case Currency.PHP: return '₱';
    default: return curr;
  }
};

export const convertAmount = (amountTWD: number, targetCurrency: Currency, rates: Record<Currency, number>): number => {
  const rate = rates[targetCurrency] || 1;
  return amountTWD / rate;
};

export const formatCurrencyDisplay = (amount: number, currency: Currency): string => {
    const decimals = CURRENCY_DECIMALS[currency];
    // If decimals is 0, round to integer. Otherwise fixed to decimals.
    if (decimals === 0) {
        return Math.round(amount).toLocaleString();
    }
    return amount.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

export const getLocalizedCategory = (category: Category, lang: Language): string => {
  return TRANSLATIONS[lang].categories[category];
};