# 後台管理系統 - 全站 Popup/Countdown 管理

## 功能概述

此系統提供完整的後台管理功能，可管理網站的全域彈出視窗和倒數計時條。主要特色包括：

- 🎯 **全站彈出視窗管理** - 靈活設定圖片、標題、內容和連結
- ⏰ **全站倒數計時條** - 頂部倒數橫幅，支援自訂樣式
- 📊 **Google Sheets 整合** - 使用 Google Sheets 作為資料來源
- 🔐 **Google OAuth 權限管理** - 安全的管理員身份驗證
- 🖼️ **雲端圖片上傳** - 支援 Cloudflare R2 圖片存儲
- 🌐 **雙 API 支援** - 同時提供 Cloudflare Functions 和 PHP 版本

## 系統架構

### 前端組件
- `GlobalPopup` - 全站彈出視窗組件
- `CountdownBanner` - 倒數計時橫幅組件
- `Admin Pages` - 後台管理介面

### API 端點
- `/api/global-config` - 獲取全域配置
- `/api/update-popup-config` - 更新彈出視窗配置
- `/api/update-countdown-config` - 更新倒數條配置
- `/api/upload-image` - 圖片上傳

### 資料來源
- Google Sheets - 主要配置存儲
- Cloudflare R2 - 圖片文件存儲

## 安裝與設定

### 1. 安裝依賴套件

```bash
npm install @react-oauth/google
```

### 2. 環境變數設定

建立 `.env.development` 和 `.env.production` 檔案：

```env
# Google Sheets API
GOOGLE_SHEETS_API_KEY=你的_API_金鑰
SPREADSHEET_ID=你的_試算表_ID

# Google OAuth
GATSBY_GOOGLE_CLIENT_ID=你的_Client_ID

# 授權管理
AUTHORIZED_EMAILS=admin@example.com,manager@example.com

# Cloudflare R2
R2_PUBLIC_DOMAIN=你的_R2_網域
```

### 3. Google Sheets 設定

請參考 [Google Sheets 設定指南](./docs/google-sheets-setup.md) 進行詳細設定。

### 4. 部署設定

#### Cloudflare Pages
1. 將 `functions/` 目錄部署到 Cloudflare Pages
2. 設定環境變數
3. 綁定 R2 bucket

#### PHP 部署
1. 將 `api/` 目錄上傳到 PHP 伺服器
2. 設定環境變數
3. 確保 PHP 支援 cURL 和 file_get_contents

## 使用方式

### 後台管理

1. 前往 `/admin` 頁面
2. 使用 Google 帳號登入
3. 驗證通過後即可管理配置

### 彈出視窗管理
- 前往 `/admin/popup`
- 設定標題、內容、圖片等
- 調整顯示時機和樣式

### 倒數條管理
- 前往 `/admin/countdown`
- 設定倒數結束時間
- 自訂背景顏色和按鈕樣式

## 檔案結構

```
src/
├── components/
│   ├── GlobalPopup/          # 彈出視窗組件
│   ├── CountdownBanner/      # 倒數條組件
│   └── GoogleOAuthWrapper/   # OAuth 包裝器
├── hooks/
│   └── useGlobalConfig.js    # 配置獲取 Hook
├── pages/admin/
│   ├── index.js              # 管理首頁
│   ├── popup.js              # 彈出視窗管理
│   └── countdown.js          # 倒數條管理
└── containers/
    ├── Layout.js             # 更新：整合新組件
    └── Header.js             # 更新：支援倒數條間距

functions/api/                # Cloudflare Functions
├── global-config.js          # 獲取配置
├── update-popup-config.js    # 更新彈出視窗
├── update-countdown-config.js # 更新倒數條
└── upload-image.js           # 圖片上傳

api/                          # PHP API
├── global-config.php
├── update-popup-config.php
├── update-countdown-config.php
└── upload-image.php

docs/
└── google-sheets-setup.md    # 設定指南
```

## 技術特色

### 響應式設計
- 支援手機、平板、桌機
- 使用 Chakra UI 響應式系統

### 即時更新
- 使用 SWR 進行資料快取和自動重新獲取
- 30 秒自動重新整理配置

### 安全性
- Google OAuth 2.0 身份驗證
- 授權電子郵件白名單
- API 存取權限控制

### 效能最佳化
- 配置快取機制
- 圖片 CDN 分發
- 延遲載入組件

## 維護與監控

### 日誌監控
- Cloudflare Functions 提供內建日誌
- PHP 錯誤記錄到 error_log

### 效能監控
- 監控 Google Sheets API 呼叫次數
- 追蹤圖片上傳使用量

### 定期維護
- 清理過期的上傳圖片
- 檢查授權列表的有效性
- 備份重要配置資料

## 疑難排解

### 常見問題
請參考 [Google Sheets 設定指南](./docs/google-sheets-setup.md) 中的疑難排解章節。

### 支援聯絡
如有技術問題，請建立 GitHub Issue 或聯絡開發團隊。

## 授權條款

此專案遵循 MIT 授權條款。