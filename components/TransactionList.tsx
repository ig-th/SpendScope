import React from 'react';
import { Expense, Category, Currency, Language } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { Coffee, Car, ShoppingBag, Film, Home, Activity, Zap, Gift, CircleDollarSign, Trash2, Pencil } from 'lucide-react';
import { getCurrencySymbol, getLocalizedCategory, formatCurrencyDisplay } from '../utils/currencyUtils';
import { TRANSLATIONS } from '../utils/translations';

interface TransactionListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  displayCurrency: Currency;
  rates: Record<Currency, number>;
  lang: Language;
}

const getCategoryIcon = (category: Category) => {
  const className = "w-5 h-5 text-white";
  switch (category) {
    case Category.Food: return <Coffee className={className} />;
    case Category.Transport: return <Car className={className} />;
    case Category.Shopping: return <ShoppingBag className={className} />;
    case Category.Entertainment: return <Film className={className} />;
    case Category.Housing: return <Home className={className} />;
    case Category.Utilities: return <Zap className={className} />;
    case Category.Health: return <Activity className={className} />;
    case Category.Others: return <Gift className={className} />;
    default: return <CircleDollarSign className={className} />;
  }
};

const TransactionList: React.FC<TransactionListProps> = ({ expenses, onDelete, onEdit, displayCurrency, rates, lang }) => {
  const t = TRANSLATIONS[lang];
  // Sort by date descending
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const displaySymbol = getCurrencySymbol(displayCurrency);
  const locale = lang === Language.ZH ? 'zh-TW' : lang === Language.JA ? 'ja-JP' : 'en-US';

  if (sortedExpenses.length === 0) {
    return (
      <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mt-6 transition-colors duration-300">
        <p className="text-slate-400">{t.list.noTransactions}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mt-6 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-slate-50 dark:border-slate-800">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{t.list.recentTransactions}</h3>
      </div>
      <div className="divide-y divide-slate-50 dark:divide-slate-800">
        {sortedExpenses.map((expense) => {
          // Calculate amount in display currency
          const rate = rates[displayCurrency];
          const displayedAmount = expense.amountTWD / rate;
          
          return (
            <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                >
                  {getCategoryIcon(expense.category)}
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{expense.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                        {getLocalizedCategory(expense.category, lang)}
                    </span>
                    <span>{new Date(expense.date).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">
                      {/* Show original amount if it differs from the selected display currency */}
                      {expense.currency !== displayCurrency && (
                          <span className="text-xs text-slate-400 font-normal mr-1">
                              {getCurrencySymbol(expense.currency)} {formatCurrencyDisplay(expense.amount, expense.currency)} ≈
                          </span>
                      )}
                      {displaySymbol} {formatCurrencyDisplay(displayedAmount, displayCurrency)}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => onEdit(expense)}
                    className="p-2 text-slate-400 hover:text-cyan-500 transition-colors"
                    title={t.actions.editExpense}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(expense.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title={t.actions.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionList;