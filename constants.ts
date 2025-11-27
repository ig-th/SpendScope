
import { Category, Currency } from './types';

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.Housing]: '#10b981', // Emerald
  [Category.Utilities]: '#06b6d4', // Cyan
  [Category.Food]: '#ef4444', // Red
  [Category.Transport]: '#f59e0b', // Amber
  [Category.Shopping]: '#3b82f6', // Blue
  [Category.Entertainment]: '#8b5cf6', // Violet
  [Category.Health]: '#ec4899', // Pink
  [Category.Others]: '#64748b', // Slate
};

// Simplified static exchange rates (Base: TWD)
// 1 Unit of Currency = X TWD
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
  [Currency.VND]: 0.0013, // 1000 VND approx 1.3 TWD
  [Currency.IDR]: 0.0021, // 1000 IDR approx 2.1 TWD
  [Currency.PHP]: 0.58,
  [Currency.MYR]: 7.25
};

// Defines the minimum unit step for input
// 0 for integer currencies (TWD, JPY, KRW, VND, IDR)
// 2 for most others
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

export const MOCK_DATA = [
  {
    id: '1',
    amount: 120,
    currency: Currency.TWD,
    amountTWD: 120,
    description: 'Breakfast sandwich',
    category: Category.Food,
    date: new Date(new Date().setHours(8, 30, 0, 0)).toISOString()
  },
  {
    id: '2',
    amount: 15,
    currency: Currency.USD,
    amountTWD: 15 * 31.5,
    description: 'Netflix Subscription',
    category: Category.Entertainment,
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
  },
  {
    id: '3',
    amount: 1200,
    currency: Currency.JPY,
    amountTWD: 1200 * 0.21,
    description: 'Ramen in Tokyo',
    category: Category.Food,
    date: new Date(new Date().setHours(19, 0, 0, 0)).toISOString()
  },
  {
    id: '4',
    amount: 1500,
    currency: Currency.TWD,
    amountTWD: 1500,
    description: 'Electricity Bill',
    category: Category.Utilities,
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString()
  }
];
