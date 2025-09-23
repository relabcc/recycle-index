# Google Sheets 設定指南

## 概述
此系統使用 Google Sheets 作為後台資料存儲，管理全站的彈出視窗和倒數計時條配置。

## Google Sheets 結構

### 1. 建立 Google Sheets

1. 前往 [Google Sheets](https://sheets.google.com)
2. 建立新的試算表
3. 重新命名為「網站管理配置」

### 2. 工作表設定

建立以下兩個工作表：

#### 工作表 1：Popup（彈出視窗）

| 欄位名稱 | 類型 | 說明 | 範例值 |
|---------|------|------|--------|
| enabled | boolean | 是否啟用彈出視窗 | true |
| title | string | 彈出視窗標題 | 特別優惠 |
| content | string | 彈出視窗內容（支援HTML） | 限時優惠，立即購買享有8折！ |
| image | string | 圖片網址 | https://example.com/popup-image.jpg |
| imageAlt | string | 圖片替代文字 | 優惠活動圖片 |
| buttonText | string | 按鈕文字 | 立即購買 |
| buttonLink | string | 按鈕連結 | https://example.com/shop |
| buttonExternal | boolean | 是否為外部連結 | true |
| closeText | string | 關閉按鈕文字 | 關閉 |
| size | string | 視窗大小 (sm/md/lg/xl) | md |
| delay | number | 延遲時間（毫秒） | 3000 |

#### 工作表 2：Countdown（倒數計時條）

| 欄位名稱 | 類型 | 說明 | 範例值 |
|---------|------|------|--------|
| enabled | boolean | 是否啟用倒數條 | true |
| title | string | 倒數條標題 | 特惠倒數 |
| endDate | string | 結束日期時間 (ISO 8601) | 2024-12-31T23:59:59.000Z |
| backgroundColor | string | 背景顏色 | #e53e3e |
| textColor | string | 文字顏色 | #ffffff |
| buttonText | string | 按鈕文字 | 搶購 |
| buttonLink | string | 按鈕連結 | https://example.com/sale |
| buttonExternal | boolean | 是否為外部連結 | true |
| buttonBg | string | 按鈕背景顏色 | #ffffff |
| buttonColor | string | 按鈕文字顏色 | #e53e3e |
| buttonHoverBg | string | 按鈕懸停背景色 | #f7fafc |
| closeable | boolean | 是否可關閉 | true |

### 3. 設定 Google Sheets API

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Google Sheets API
4. 建立 API 金鑰
5. 設定 OAuth 2.0 憑證（用於後台登入）

### 4. 權限設定

1. 將 Google Sheets 分享給需要存取權限的使用者
2. 在環境變數中設定授權的電子郵件地址列表
3. 確保 API 金鑰有存取該試算表的權限

## 環境變數設定

在部署環境中設定以下環境變數：

```
GOOGLE_SHEETS_API_KEY=你的_Google_Sheets_API_金鑰
SPREADSHEET_ID=你的_試算表_ID
GATSBY_GOOGLE_CLIENT_ID=你的_Google_OAuth_Client_ID
AUTHORIZED_EMAILS=admin@example.com,manager@example.com
R2_PUBLIC_DOMAIN=你的_Cloudflare_R2_網域
```

## 使用說明

1. 後台管理者使用 Google 帳號登入
2. 系統驗證登入者是否在授權列表中
3. 通過驗證後可編輯彈出視窗和倒數條設定
4. 設定會即時同步到 Google Sheets
5. 前端會定期從 Google Sheets 讀取最新配置

## 安全性考量

- 使用 OAuth 2.0 進行身份驗證
- 僅授權的電子郵件地址可存取後台
- API 金鑰應安全存儲在環境變數中
- 定期檢查和更新授權列表

## 疑難排解

### 常見問題

1. **無法讀取 Google Sheets**
   - 檢查 API 金鑰是否正確
   - 確認試算表 ID 是否正確
   - 檢查試算表權限設定

2. **登入失敗**
   - 檢查 Google OAuth Client ID
   - 確認電子郵件是否在授權列表中
   - 檢查網域設定

3. **圖片上傳失敗**
   - 檢查 Cloudflare R2 設定
   - 確認檔案大小和格式是否符合限制