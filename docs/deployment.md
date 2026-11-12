# 正式部署：Hosting.com

正式網站部署在 Hosting.com。發布方式是產生靜態網站壓縮檔、上傳至主機，再解壓縮覆蓋網站檔案。

- GitHub Pages 已停用；`npm run deploy` 是舊流程，不要用來發布正式站。
- Cloudflare Pages 是測試站，不是正式發布目標。
- Hosting.com 的實際網站根目錄依 Hosting.com 帳戶設定為準；本專案沒有記錄該目錄路徑。

## 產生發布檔

在專案根目錄執行：

```bash
npm run pack
```

這會執行 `pack.sh`，依序清除 Gatsby 快取、重新建置網站，並將 `public/` 的內容打包成專案根目錄下的 `recycle-public.tar.gz`。Windows 環境需能在 PATH 中執行 Bash；可從 Git Bash 執行 `bash pack.sh`。

若只執行 `npm run build`，它只會產生 `public/`，不會建立發布壓縮檔。

## 上傳並覆蓋正式站

1. 將程式碼變更提交並推送至 Git 儲存庫，保留本次發布對應的來源版本。
2. 在 Hosting.com 備份目前網站根目錄，方便需要時回復。
3. 將 `recycle-public.tar.gz` 上傳到 Hosting.com。解壓縮時，目標要選網站根目錄，並覆蓋同名檔案。
4. 確認 `index.html` 直接位於網站根目錄，頁面檔案位於對應路徑，例如 `trash/115/index.html`；不要多解出一層 `public/` 目錄。
5. 解壓完成後，從網站根目錄移除壓縮檔，避免發布檔留在可公開下載的位置。
6. 開啟正式首頁及 <https://recycle.rethinktw.org/trash/115/>，重新整理並確認頁面、資源及直接網址都正常。

如果使用 SSH 解壓，命令格式如下；請將路徑替換成 Hosting.com 帳戶中實際設定的網站根目錄：

```bash
tar -xzf recycle-public.tar.gz -C /path/to/webroot
```

## 回復方式

若發布後發現問題，將備份的網站根目錄檔案還原，再確認首頁與直接頁面網址正常。修正後重新執行 `npm run pack`，再上傳新的壓縮檔。

## 發布範圍

`pack.sh` 只打包 Gatsby 產生的 `public/` 靜態網站檔案。Cloudflare Pages 的設定與 `functions/` 後端 Functions 不會包含在這個壓縮檔中；若要發布後端或 API 變更，需另走對應的後端部署流程。
