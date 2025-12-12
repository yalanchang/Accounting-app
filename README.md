# Nuxt.js 記帳系統

一個使用 **Nuxt 3 + MySQL** 建立的全端記帳應用程式。

# 專案結構

```
accounting-app/
├── pages/              # 頁面（自動路由）
│   ├── index.vue       # 首頁
│   ├── transactions.vue # 交易記錄
│   ├── stats.vue       # 統計分析
│   └── categories.vue  # 分類管理
│
├── components/         # 共用元件
│   └── TransactionForm.vue
│
├── composables/        # 可組合函數
│   └── useAccounting.ts
│
├── server/             # 後端 API（Nuxt Server Routes）
│   ├── api/
│   │   ├── transactions/   # 交易 API
│   │   ├── categories/     # 分類 API
│   │   └── stats/          # 統計 API
│   └── utils/
│       └── db.ts       # 資料庫連線
│
├── database/
│   └── init.sql        # 資料庫初始化
│
├── nuxt.config.ts      # Nuxt 設定
└── package.json