export enum Currency {
  TWD = 'TWD',
  USD = 'USD',
  JPY = 'JPY',
  EUR = 'EUR',
  KRW = 'KRW',
  THB = 'THB',
  CNY = 'CNY',
  HKD = 'HKD',
  SGD = 'SGD',
  GBP = 'GBP',
  AUD = 'AUD',
  CAD = 'CAD',
  VND = 'VND', // Vietnam
  IDR = 'IDR', // Indonesia
  PHP = 'PHP', // Philippines
  MYR = 'MYR'  // Malaysia
}

export enum Category {
  Food = 'Food & Groceries',
  Transport = 'Transportation',
  Shopping = 'Shopping',
  Housing = 'Housing',
  Utilities = 'Utilities',
  Entertainment = 'Entertainment',
  Health = 'Health',
  Others = 'Gifts & Others'
}

export enum TimeFilter {
  Day = 'Day',
  Month = 'Month',
  Year = 'Year'
}

export enum Language {
  EN = 'EN',
  ZH = 'ZH',
  JA = 'JA'
}

export interface Expense {
  id: string;
  amount: number;
  currency: Currency;
  amountTWD: number; // Normalized amount for charts
  description: string;
  category: Category;
  date: string; // ISO String
}

export interface DailyStat {
  label: string;
  amount: number;
}

export interface CategoryStat {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}