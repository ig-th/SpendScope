import { Category, Currency } from './types';

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.Transport]: '#f59e0b', // Amber-500
  [Category.Food]: '#f97316', // Orange-500
  [Category.Utilities]: '#06b6d4', // Cyan-500
  [Category.Shopping]: '#8b5cf6', // Violet-500
  [Category.Housing]: '#10b981', // Emerald-500
  [Category.Entertainment]: '#ec4899', // Pink-500
  [Category.Health]: '#ef4444', // Red-500
  [Category.Others]: '#64748b', // Slate-500
};

export const EXCHANGE_RATES: Record<Currency, number> = {
  [Currency.TWD]: 1,
  [Currency.USD]: 31.5,
  [Currency.JPY]: 0.21,
  [Currency.EUR]: 34.2,
  [Currency.KRW]: 0.024,
  [Currency.THB]: 0.92,
  [Currency.CNY]: 4.35,
  [Currency.HKD]: 4.05,
  [Currency.SGD]: 23.5,
  [Currency.GBP]: 40.8,
  [Currency.AUD]: 20.5,
  [Currency.CAD]: 22.8,
  [Currency.VND]: 0.0013,
  [Currency.IDR]: 0.0021,
  [Currency.PHP]: 0.58,
  [Currency.MYR]: 7.25
};

export const CURRENCY_DECIMALS: Record<Currency, number> = {
  [Currency.TWD]: 0,
  [Currency.JPY]: 0,
  [Currency.KRW]: 0,
  [Currency.VND]: 0,
  [Currency.IDR]: 0,
  [Currency.USD]: 2,
  [Currency.EUR]: 2,
  [Currency.THB]: 2,
  [Currency.CNY]: 2,
  [Currency.HKD]: 2,
  [Currency.SGD]: 2,
  [Currency.GBP]: 2,
  [Currency.AUD]: 2,
  [Currency.CAD]: 2,
  [Currency.PHP]: 2,
  [Currency.MYR]: 2
};