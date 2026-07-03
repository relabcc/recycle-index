#!/usr/bin/env bash
# Build the Gatsby site and package public/ into a UTF-8 tar.gz that extracts
# cleanly on a Linux server (Chinese filenames stay intact).
#
# Usage:
#   ./pack.sh                 # clean build + package -> ./recycle-public.tar.gz
#   ./pack.sh out.tar.gz      # custom output path
#   ./pack.sh --no-build      # package existing public/ without rebuilding
#
# On the server:
#   tar -xzf recycle-public.tar.gz -C /path/to/webroot
set -euo pipefail
cd "$(dirname "$0")"

BUILD=1
OUT="recycle-public.tar.gz"
for arg in "$@"; do
  case "$arg" in
    --no-build) BUILD=0 ;;
    *) OUT="$arg" ;;
  esac
done

if [ "$BUILD" -eq 1 ]; then
  # clean first: avoids stale files bloating public/ AND the occasional build hang
  echo "==> gatsby clean"
  npx gatsby clean
  echo "==> gatsby build"
  npm run build
fi

# 防呆：清掉任何誤留在 public 內的壓縮檔（曾發生 public/public.tar.gz 被一起打包，體積翻倍）
find public -maxdepth 2 -type f \( -name '*.tar.gz' -o -name '*.zip' -o -name '*.tar' \) -delete 2>/dev/null || true

echo "==> packaging -> $OUT (UTF-8 filenames)"
rm -f "$OUT"
# --force-local: 別把 Windows 的 C: 當成遠端主機
# GNU tar 原樣保留檔名位元組，public/ 的檔名已是 UTF-8 → Linux 不亂碼
tar --force-local --exclude='*.tar.gz' --exclude='*.zip' -czf "$OUT" -C public .

echo "==> done: $(ls -lh "$OUT" | awk '{print $5}')  ->  $OUT"
echo "    server: tar -xzf $(basename "$OUT") -C /path/to/webroot"
