# FANTACO 魔幻藝術節 網站

純靜態網站（GitHub Pages，網域 fantaco.com.tw）。推到 `main` 即上線。

## 歷屆回顧（/archive/）

`/archive/` 與 `/archive/<年份>/` 由程式產生，**不要直接改這些 HTML**，改資料後重新產生：

```
python3 _src/archive/build.py
```

| 檔案 | 用途 |
|---|---|
| `_src/archive/editions.json` | 每一屆的資料：屆別、名稱、日期、入口卡片照片與 3 個數字、該屆數據、精華影片、照片清單 |
| `_src/archive/pages/<年份>.html` | 該屆頁面的內文（故事、陣容、時刻表、地圖等）。`<!--RC:EXTRAS-->` 會插入數據＋精華影片＋照片牆，`<!--RC:PAGER-->` 會插入上一屆／下一屆按鈕 |
| `_src/archive/pages/_follow.html` | 頁尾「明年見」區塊 |
| `_src/archive/layout.html` | 共用頁首、選單、頁尾 |

排序一律依 `year` **由新到舊**（入口卡片、上一屆／下一屆按鈕都自動處理）。

### 新增一屆（例：明年把第三屆移進歷屆回顧）

1. 照片轉成 WebP 放到 `assets/recap/`（每張兩種尺寸：`xxx-800.webp`、`xxx-1800.webp`）；精華短片（靜音、約 10 秒、1280×720 mp4）放 `assets/recap/e3loop.mp4`。
2. 在 `editions.json` 的 `editions` 加一筆（照 2025 那筆的格式填 year、no、name、dates、title、desc、card、loop、stats、gallery）。數字只放有正式來源的數據。
3. 新增 `_src/archive/pages/2026.html`（可複製 2025 改內容），保留 `<!--RC:EXTRAS-->` 與 `<!--RC:PAGER-->` 兩個標記。
4. 執行 `python3 _src/archive/build.py`，本機預覽 `/archive/`，確認後 commit 並推到 `main`。
5. 首頁改為新一屆時，`sitemap.xml` 補上 `/archive/<年份>/`。

### 數據來源

前兩屆數字皆出自贊助簡報「Fantaco魔術節_前兩屆成果.pptx」（2026-07-29 版）：第一屆見第 3、7 頁；第二屆見第 15、22 頁。「5 演出區」依第二屆官方節目表。
