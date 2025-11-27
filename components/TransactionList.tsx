import React, { useState, useRef } from 'react';
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

interface SwipeableItemProps {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({ children, onEdit, onDelete }) => {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentOffset = useRef(0);
  const isVerticalScroll = useRef(false);
  const threshold = 70;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isVerticalScroll.current = false;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isVerticalScroll.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX.current;
    const diffY = currentY - startY.current;

    if (Math.abs(diffY) > Math.abs(diffX)) {
      isVerticalScroll.current = true;
      setOffset(0);
      return;
    }

    if (diffX > 150) currentOffset.current = 150 + (diffX - 150) * 0.2;
    else if (diffX < -150) currentOffset.current = -150 + (diffX + 150) * 0.2;
    else currentOffset.current = diffX;

    setOffset(currentOffset.current);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (isVerticalScroll.current) {
      isVerticalScroll.current = false;
      return;
    }

    const finalOffset = currentOffset.current;
    setOffset(0);
    currentOffset.current = 0;

    if (finalOffset > threshold) {
      setTimeout(() => onEdit(), 50);
    } else if (finalOffset < -threshold) {
      setTimeout(() => onDelete(), 50);
    }
  };

  const handleTouchCancel = () => {
    setIsDragging(false);
    isVerticalScroll.current = false;
    setOffset(0);
    currentOffset.current = 0;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    if (e.buttons !== 1) {
        handleMouseUp();
        return;
    }
    const currentX = e.clientX;
    const diff = currentX - startX.current;

    if (diff > 150) currentOffset.current = 150 + (diff - 150) * 0.2;
    else if (diff < -150) currentOffset.current = -150 + (diff + 150) * 0.2;
    else currentOffset.current = diff;

    setOffset(currentOffset.current);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const finalOffset = currentOffset.current;

    setOffset(0);
    currentOffset.current = 0;

    if (finalOffset > threshold) {
      setTimeout(() => onEdit(), 50);
    } else if (finalOffset < -threshold) {
      setTimeout(() => onDelete(), 50);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
        setIsDragging(false);
        setOffset(0);
        currentOffset.current = 0;
    }
  };

  let bgClass = "";
  let icon = null;
  let justify = "";
  let opacity = Math.min(Math.abs(offset) / (threshold * 0.8), 1);

  if (offset > 0) {
    bgClass = "bg-cyan-500";
    justify = "justify-start";
    icon = (
      <div className="flex items-center px-6 text-white transform transition-transform duration-200" style={{ opacity, transform: `scale(${0.5 + opacity * 0.5})` }}>
        <Pencil className="w-6 h-6" />
      </div>
    );
  } else if (offset < 0) {
    bgClass = "bg-red-500";
    justify = "justify-end";
    icon = (
      <div className="flex items-center px-6 text-white transform transition-transform duration-200" style={{ opacity, transform: `scale(${0.5 + opacity * 0.5})` }}>
        <Trash2 className="w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden select-none bg-white dark:bg-slate-900">
      <div className={`absolute inset-0 flex items-center ${justify} ${bgClass} transition-colors duration-200`}>
        {Math.abs(offset) > 10 && icon}
      </div>

      <div
        className="relative bg-white dark:bg-slate-900"
        style={{
            transform: `translate3d(${offset}px, 0, 0)`,
            touchAction: 'pan-y',
            transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
            cursor: isDragging ? 'grabbing' : 'grab',
            willChange: 'transform'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </div>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({ expenses, onDelete, onEdit, displayCurrency, rates, lang }) => {
  const t = TRANSLATIONS[lang];
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
          const rate = rates[displayCurrency];
          const displayedAmount = expense.amountTWD / rate;

          return (
            <SwipeableItem
                key={expense.id}
                onEdit={() => onEdit(expense)}
                onDelete={() => onDelete(expense.id)}
            >
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                    <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                    >
                    {getCategoryIcon(expense.category)}
                    </div>
                    <div className="min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">{expense.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            {getLocalizedCategory(expense.category, lang)}
                        </span>
                        <span className="whitespace-nowrap">{new Date(expense.date).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <p className="font-bold text-slate-800 dark:text-slate-100">
                        {expense.currency !== displayCurrency && (
                            <span className="text-xs text-slate-400 font-normal mr-1 block sm:inline">
                                {getCurrencySymbol(expense.currency)} {formatCurrencyDisplay(expense.amount, expense.currency)} ≈
                            </span>
                        )}
                        {displaySymbol} {formatCurrencyDisplay(displayedAmount, displayCurrency)}
                    </p>
                </div>
                </div>
            </SwipeableItem>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionList;