# 部署指南

## Cloudflare Pages 部署

### 1. 準備工作

1. 確保您有 Cloudflare 帳號
2. 設定 Google Cloud 專案並啟用 Google Sheets API
3. 準備 Google OAuth 2.0 憑證

### 2. 部署步驟

1. **連接 GitHub 倉庫**
   - 登入 Cloudflare Dashboard
   - 前往 Pages 面板
   - 點擊 "Create a project"
   - 連接您的 GitHub 倉庫

2. **設定建置配置**
   ```
   Build command: npm run build
   Build output directory: public
   Root directory: /
   ```

3. **環境變數設定**
   在 Cloudflare Pages 設定中新增：
   ```
   GOOGLE_SHEETS_API_KEY=your_api_key
   SPREADSHEET_ID=your_spreadsheet_id
   GATSBY_GOOGLE_CLIENT_ID=your_client_id
   AUTHORIZED_EMAILS=admin@example.com,manager@example.com
   R2_PUBLIC_DOMAIN=your_r2_domain
   ```

4. **R2 Bucket 綁定**
   - 建立 R2 Bucket
   - 在 Pages 設定中綁定 R2 Bucket
   - 變數名稱：`R2_BUCKET`

### 3. Functions 部署

Cloudflare Pages Functions 會自動部署 `functions/` 目錄中的檔案。

## PHP 伺服器部署

### 1. 伺服器需求

- PHP 7.4 或更高版本
- cURL 支援
- 檔案寫入權限

### 2. 部署步驟

1. **上傳檔案**
   ```bash
   # 上傳 api/ 目錄到伺服器
   scp -r api/ user@server:/var/www/html/
   
   # 上傳建置後的靜態檔案
   scp -r public/ user@server:/var/www/html/
   ```

2. **設定權限**
   ```bash
   # 設定上傳目錄權限
   mkdir -p /var/www/html/uploads/admin-images
   chmod 755 /var/www/html/uploads/admin-images
   
   # 設定 API 檔案權限
   chmod 644 /var/www/html/api/*.php
   ```

3. **環境變數設定**
   建立 `.env` 檔案或在 PHP 中設定：
   ```php
   $_ENV['GOOGLE_SHEETS_API_KEY'] = 'your_api_key';
   $_ENV['SPREADSHEET_ID'] = 'your_spreadsheet_id';
   $_ENV['AUTHORIZED_EMAILS'] = 'admin@example.com,manager@example.com';
   ```

### 3. Apache/Nginx 設定

**Apache (.htaccess)**
```apache
RewriteEngine On
RewriteRule ^api/(.*)$ api/$1.php [L]

# CORS headers
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
```

**Nginx**
```nginx
location /api/ {
    rewrite ^/api/(.*)$ /api/$1.php last;
}

location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
}

# CORS headers
add_header Access-Control-Allow-Origin "*";
add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
add_header Access-Control-Allow-Headers "Content-Type, Authorization";
```

## Google Sheets 設定

### 1. 建立試算表

1. 前往 [Google Sheets](https://sheets.google.com)
2. 建立新試算表：「網站管理配置」
3. 建立兩個工作表：`Popup` 和 `Countdown`
4. 按照文件中的欄位結構設定

### 2. API 設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com)
2. 建立專案或選擇現有專案
3. 啟用 Google Sheets API
4. 建立 API 金鑰
5. 建立 OAuth 2.0 憑證

### 3. 權限設定

1. 將試算表分享給需要編輯的使用者
2. 設定 OAuth 授權網域
3. 新增授權的重新導向 URI

## 測試部署

### 1. 功能測試

- 存取 `/demo` 頁面測試組件
- 存取 `/admin` 頁面測試後台
- 測試 Google OAuth 登入
- 測試配置更新功能

### 2. API 測試

```bash
# 測試配置 API
curl https://your-domain.com/api/global-config

# 測試圖片上傳（需要授權）
curl -X POST https://your-domain.com/api/upload-image \
  -H "Authorization: Bearer your_token" \
  -F "image=@test.jpg"
```

## 監控與維護

### 1. 日誌監控

- **Cloudflare**: 在 Dashboard 中檢視 Functions 日誌
- **PHP**: 檢查 error_log 檔案

### 2. 效能監控

- 監控 Google Sheets API 使用量
- 追蹤圖片存儲使用量
- 監控頁面載入速度

### 3. 安全性

- 定期更新授權電子郵件清單
- 監控異常的 API 呼叫
- 定期檢查上傳檔案

## 疑難排解

### 常見問題

1. **CORS 錯誤**
   - 檢查伺服器 CORS 設定
   - 確認 API 路徑正確

2. **Google Sheets 權限錯誤**
   - 檢查 API 金鑰權限
   - 確認試算表分享設定

3. **OAuth 登入失敗**
   - 檢查 Client ID 設定
   - 確認授權網域設定

4. **圖片上傳失敗**
   - 檢查上傳目錄權限
   - 確認檔案大小限制