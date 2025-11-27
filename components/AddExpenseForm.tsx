
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Save, X, RefreshCw, Calendar } from 'lucide-react';

import { Category, Currency, Expense, TimeFilter, Language } from '../types';
import { CURRENCY_DECIMALS } from '../constants';
import { TRANSLATIONS } from '../utils/translations';
import CustomDatePicker from './CustomDatePicker';
import CustomSelect from './CustomSelect';

interface AddExpenseFormProps {
  onSubmit: (expense: Expense) => void;
  initialData?: Expense | null;
  onCancel?: () => void;
  currentRates: Record<Currency, number>;
  onRateUpdate: (currency: Currency, rate: number) => void;
  lang: Language;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  currentRates,
  onRateUpdate,
  lang 
}) => {
  const t = TRANSLATIONS[lang];
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>(Currency.TWD);
  const [exchangeRate, setExchangeRate] = useState<string>('1');
  
  // Use local time for default date
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(Category.Food);
  
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setCurrency(initialData.currency);
      setDate(new Date(initialData.date));
      setDescription(initialData.description);
      setCategory(initialData.category);

      const usedRate = initialData.amountTWD / initialData.amount;
      setExchangeRate(usedRate.toFixed(4).replace(/\.?0+$/, ''));
    } else {
        setAmount('');
        setCurrency(Currency.TWD);
        setExchangeRate('1');
        setDate(new Date());
        setDescription('');
        setCategory(Category.Food);
    }
  }, [initialData]);

  useEffect(() => {
      if (!initialData) {
          setExchangeRate(currentRates[currency].toString());
      }
  }, [currency, currentRates, initialData]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    if (amount) {
        const val = parseFloat(amount);
        if (!isNaN(val)) {
            const decimals = CURRENCY_DECIMALS[newCurrency];
            // Format to exact decimals (e.g. 100 -> "100.00" or "100")
            setAmount(val.toFixed(decimals));
        }
    }
  };

  const handleAmountBlur = () => {
      if (!amount) return;
      const val = parseFloat(amount);
      if (!isNaN(val)) {
          const decimals = CURRENCY_DECIMALS[currency];
          // Format to exact decimals on blur
          setAmount(val.toFixed(decimals));
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentRateVal = parseFloat(exchangeRate);
    
    // Logic: Only ask to update default rate if 
    // 1. Rate is valid and changed
    // 2. The expense date is TODAY (don't update default rate if backfilling old data)
    if (!isNaN(currentRateVal) && currentRateVal !== currentRates[currency]) {
        const isToday = new Date().toDateString() === date.toDateString();
        if (isToday) {
            const confirmMessage = t.messages.confirmRateUpdate
                .replace('{currency}', currency)
                .replace('{rate}', currentRateVal.toString());
            
            const confirmUpdate = window.confirm(confirmMessage);
            if (confirmUpdate) {
                onRateUpdate(currency, currentRateVal);
            }
        }
    }

    const expense: Expense = {
      id: initialData?.id || crypto.randomUUID(),
      amount: parseFloat(amount),
      currency,
      amountTWD: parseFloat(amount) * currentRateVal,
      description,
      category,
      date: date.toISOString()
    };
    onSubmit(expense);
    
    if (!initialData) {
      setAmount('');
      setDescription('');
      setDate(new Date());
      setCategory(Category.Food);
    }
  };

  const displayDate = date.toLocaleDateString(
    lang === Language.ZH ? 'zh-TW' : lang === Language.JA ? 'ja-JP' : 'en-US', 
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  const currencyOptions = Object.values(Currency).map(c => ({ value: c, label: c }));
  const categoryOptions = Object.values(Category).map(c => ({ value: c, label: t.categories[c] }));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          {initialData ? <RefreshCw className="w-5 h-5 text-cyan-600" /> : <Plus className="w-5 h-5 text-cyan-600" />}
          {initialData ? t.actions.editExpense : t.actions.addExpense}
        </h2>
        {onCancel && (
          <button 
            type="button"
            onClick={onCancel} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
            title={t.actions.close}
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.form.amount}</label>
            <div className="relative">
                <input
                    type="number"
                    step={CURRENCY_DECIMALS[currency] === 0 ? "1" : "0.01"}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onBlur={handleAmountBlur}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-slate-800 dark:text-white font-mono text-lg"
                    placeholder={CURRENCY_DECIMALS[currency] === 0 ? "0" : "0.00"}
                    required
                    title={t.form.tooltipAmount}
                    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(t.form.validationRequired)}
                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.form.currency}</label>
            <CustomSelect
                value={currency}
                options={currencyOptions}
                onChange={handleCurrencyChange}
            />
          </div>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.form.rate}</label>
                {amount && exchangeRate && (
                    <span className="text-xs text-slate-400 font-mono">
                        {t.form.ratePreview} {Math.round(parseFloat(amount) * parseFloat(exchangeRate)).toLocaleString()}
                    </span>
                )}
            </div>
            <input
                type="number"
                step="0.0001"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-slate-600 dark:text-slate-300 font-mono text-sm"
                required
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.form.category}</label>
                <CustomSelect
                    value={category}
                    options={categoryOptions}
                    onChange={(val) => setCategory(val)}
                />
            </div>

            <div className="space-y-2 relative" ref={datePickerRef}>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.form.date}</label>
                <button
                    type="button"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-slate-800 dark:text-white text-left flex items-center justify-between"
                >
                    <span>{displayDate}</span>
                    <Calendar className="w-4 h-4 text-slate-400" />
                </button>
                <CustomDatePicker 
                    isOpen={isDatePickerOpen}
                    selectedDate={date}
                    onSelect={(d) => {
                        setDate(d);
                        setIsDatePickerOpen(false);
                    }}
                    filter={TimeFilter.Day}
                    onClose={() => setIsDatePickerOpen(false)}
                    lang={lang}
                />
            </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.form.description}</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-slate-800 dark:text-white"
            placeholder={t.categoryPlaceholders[category]}
            required
            title={t.form.tooltipDesc}
            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(t.form.validationRequired)}
            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
          />
        </div>

        <div className="pt-4 flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              {t.actions.cancel}
            </button>
          )}
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-700 hover:shadow-lg hover:shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {initialData ? t.actions.save : t.actions.addExpense}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpenseForm;
