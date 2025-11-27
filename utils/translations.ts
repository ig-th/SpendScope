import { Category, Language, TimeFilter } from '../types';

export const TRANSLATIONS = {
  [Language.EN]: {
    appName: "SpendScope",
    actions: {
      export: "Export Data",
      import: "Import Data",
      toggleTheme: "Toggle Theme",
      switchLanguage: "Switch Language",
      add: "Add",
      addExpense: "Add Expense",
      editExpense: "Edit Expense",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      delete: "Delete",
      reset: "Reset"
    },
    filters: {
      [TimeFilter.Day]: "Day",
      [TimeFilter.Month]: "Month",
      [TimeFilter.Year]: "Year",
    },
    form: {
      amount: "Amount",
      currency: "Currency",
      rate: "Exchange Rate (to TWD)",
      ratePreview: "≈ NT$",
      date: "Date",
      time: "Time",
      description: "Description",
      category: "Category",
      placeholderAmount: "0.00",
      placeholderDesc: "e.g. Netflix Subscription",
      validationRequired: "Please fill out this field.",
      tooltipAmount: "Enter the transaction amount",
      tooltipDesc: "Details like items, location, or purpose"
    },
    stats: {
      totalSpending: "Total Spending",
      spendingByCategory: "Spending by Category",
      trendAnalysis: "Trend Analysis",
      allCategories: "All Categories",
      noData: "No data",
      in: "in" // e.g. "in USD"
    },
    list: {
      recentTransactions: "Recent Transactions",
      noTransactions: "No transactions recorded yet."
    },
    messages: {
      importSuccess: "Successfully imported {count} transactions.",
      importNoNew: "No new data found to import. (Duplicate IDs skipped)",
      importInvalid: "Invalid file format.",
      importError: "Failed to parse JSON file.",
      confirmRateUpdate: "Update default exchange rate for {currency} to {rate}?",
      confirmDelete: "Delete this transaction?"
    },
    categories: {
      [Category.Food]: "Food & Groceries",
      [Category.Transport]: "Transportation",
      [Category.Shopping]: "Shopping",
      [Category.Housing]: "Housing",
      [Category.Utilities]: "Utilities",
      [Category.Entertainment]: "Entertainment",
      [Category.Health]: "Health",
      [Category.Others]: "Gifts & Others"
    },
    categoryPlaceholders: {
      [Category.Food]: "e.g. Sandwich, Grocery shopping",
      [Category.Transport]: "e.g. Gas, Subway ticket",
      [Category.Shopping]: "e.g. New shoes, Gadgets",
      [Category.Housing]: "e.g. Rent, Furniture",
      [Category.Utilities]: "e.g. Electricity bill, Phone plan",
      [Category.Entertainment]: "e.g. Netflix Subscription, Cinema",
      [Category.Health]: "e.g. Pharmacy, Gym membership",
      [Category.Others]: "e.g. Birthday gift, Charity"
    },
    datePicker: {
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    },
    timePicker: {
      hour: "Hr",
      minute: "Min"
    }
  },
  [Language.ZH]: {
    appName: "SpendScope",
    actions: {
      export: "匯出資料",
      import: "匯入資料",
      toggleTheme: "切換主題",
      switchLanguage: "切換語言",
      add: "新增",
      addExpense: "新增支出",
      editExpense: "編輯支出",
      save: "儲存",
      cancel: "取消",
      close: "關閉",
      delete: "刪除",
      reset: "重置"
    },
    filters: {
      [TimeFilter.Day]: "日",
      [TimeFilter.Month]: "月",
      [TimeFilter.Year]: "年",
    },
    form: {
      amount: "金額",
      currency: "幣別",
      rate: "匯率 (對台幣)",
      ratePreview: "≈ NT$",
      date: "日期",
      time: "時間",
      description: "描述",
      category: "分類",
      placeholderAmount: "0.00",
      placeholderDesc: "例如：悠遊卡儲值",
      validationRequired: "請填寫這個欄位",
      tooltipAmount: "請輸入實際交易金額",
      tooltipDesc: "紀錄品項、地點或用途等細節"
    },
    stats: {
      totalSpending: "總花費",
      spendingByCategory: "花費分類",
      trendAnalysis: "趨勢分析",
      allCategories: "所有分類",
      noData: "無資料",
      in: "以" // e.g. "以 USD 計算"
    },
    list: {
      recentTransactions: "近期交易",
      noTransactions: "尚無交易紀錄"
    },
    messages: {
      importSuccess: "成功匯入 {count} 筆交易資料。",
      importNoNew: "未發現新資料可匯入 (重複的 ID 已略過)。",
      importInvalid: "檔案格式無效。",
      importError: "解析 JSON 檔案失敗。",
      confirmRateUpdate: "是否將 {currency} 的預設匯率更新為 {rate}？",
      confirmDelete: "確定要刪除這筆交易嗎？"
    },
    categories: {
      [Category.Food]: "食物與雜貨",
      [Category.Transport]: "交通",
      [Category.Shopping]: "購物",
      [Category.Housing]: "居住",
      [Category.Utilities]: "水電雜支",
      [Category.Entertainment]: "娛樂",
      [Category.Health]: "醫療健康",
      [Category.Others]: "禮物與其他"
    },
    categoryPlaceholders: {
      [Category.Food]: "例如：早餐三明治、超市買菜",
      [Category.Transport]: "例如：捷運加值、加油",
      [Category.Shopping]: "例如：衣服、網購",
      [Category.Housing]: "例如：房租、家具",
      [Category.Utilities]: "例如：電費、手機費",
      [Category.Entertainment]: "例如：Netflix 訂閱、電影票",
      [Category.Health]: "例如：掛號費、健身房",
      [Category.Others]: "例如：生日禮物、捐款"
    },
    datePicker: {
      months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      weekdays: ["日", "一", "二", "三", "四", "五", "六"]
    },
    timePicker: {
      hour: "時",
      minute: "分"
    }
  },
  [Language.JA]: {
    appName: "SpendScope",
    actions: {
      export: "データのエクスポート",
      import: "データのインポート",
      toggleTheme: "テーマの切り替え",
      switchLanguage: "言語を切り替え",
      add: "追加",
      addExpense: "経費を追加",
      editExpense: "経費を編集",
      save: "保存",
      cancel: "キャンセル",
      close: "閉じる",
      delete: "削除",
      reset: "リセット"
    },
    filters: {
      [TimeFilter.Day]: "日",
      [TimeFilter.Month]: "月",
      [TimeFilter.Year]: "年",
    },
    form: {
      amount: "金額",
      currency: "通貨",
      rate: "為替レート (対TWD)",
      ratePreview: "≈ NT$",
      date: "日付",
      time: "時間",
      description: "説明",
      category: "カテゴリ",
      placeholderAmount: "0.00",
      placeholderDesc: "例：Suicaチャージ",
      validationRequired: "このフィールドに入力してください",
      tooltipAmount: "取引金額を入力してください",
      tooltipDesc: "品目、場所、目的などの詳細"
    },
    stats: {
      totalSpending: "総支出",
      spendingByCategory: "カテゴリ別支出",
      trendAnalysis: "傾向分析",
      allCategories: "全てのカテゴリ",
      noData: "データなし",
      in: "通貨:" // e.g. "通貨: USD"
    },
    list: {
      recentTransactions: "最近の取引",
      noTransactions: "取引記録はまだありません"
    },
    messages: {
      importSuccess: "{count} 件の取引データをインポートしました。",
      importNoNew: "インポートする新しいデータが見つかりませんでした (重複IDはスキップされました)。",
      importInvalid: "ファイル形式が無効です。",
      importError: "JSONファイルの解析に失敗しました。",
      confirmRateUpdate: "{currency} のデフォルト為替レートを {rate} に更新しますか？",
      confirmDelete: "この取引を削除しますか？"
    },
    categories: {
      [Category.Food]: "食費・日用品",
      [Category.Transport]: "交通費",
      [Category.Shopping]: "買い物",
      [Category.Housing]: "住居費",
      [Category.Utilities]: "水道光熱費",
      [Category.Entertainment]: "娯楽費",
      [Category.Health]: "健康・医療",
      [Category.Others]: "交際費・その他"
    },
    categoryPlaceholders: {
      [Category.Food]: "例：ランチ、スーパーで買い物",
      [Category.Transport]: "例：Suicaチャージ、ガソリン",
      [Category.Shopping]: "例：服、Amazon",
      [Category.Housing]: "例：家賃、家具",
      [Category.Utilities]: "例：電気代、携帯料金",
      [Category.Entertainment]: "例：Netflix、映画",
      [Category.Health]: "例：病院、ジム",
      [Category.Others]: "例：プレゼント、寄付"
    },
    datePicker: {
      months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      weekdays: ["日", "月", "火", "水", "木", "金", "土"]
    },
    timePicker: {
      hour: "時",
      minute: "分"
    }
  }
};