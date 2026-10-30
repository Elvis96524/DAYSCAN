# DayScan · 美股日内交易扫描器

单文件 HTML 应用（Tailwind CDN + TradingView Lightweight Charts），数据来自 FMP 免费 API，面向 eToro 交易者。支持安装到手机主屏幕（PWA）。

## 文件清单

| 文件 | 作用 |
|---|---|
| `index.html` | 应用本体（HTML + CSS + JS） |
| `manifest.webmanifest` | PWA 配置：名称、图标、独立窗口显示 |
| `sw.js` | Service Worker：缓存应用外壳，可离线打开；**不缓存 FMP API** |
| `icon-192.png` / `icon-512.png` | 应用图标 |
| `.nojekyll` | 告诉 GitHub Pages 不要用 Jekyll 处理文件 |
| `README.md` | 本说明 |

## 一、创建 GitHub 仓库并发布

### 方式 A：网页操作（手机或电脑浏览器都行，无需命令行）

1. 登录 github.com → 右上角 **+** → **New repository**。
2. Repository name 填 `dayscan`（可自定），选 **Public**（免费账号的 GitHub Pages 需要公开仓库），点 **Create repository**。
3. 进入仓库页 → **Add file → Upload files**，把本目录里的**全部文件**（含 `.nojekyll`）拖进去，点 **Commit changes**。
   - 提示：`.nojekyll` 是隐藏文件，手机上可能选不到。选不到也没关系，本应用没有下划线开头的文件夹，不加也能正常发布。
4. 仓库 → **Settings → Pages** → Source 选 **Deploy from a branch** → Branch 选 `main`、目录 `/ (root)` → **Save**。
5. 等 1～2 分钟，页面顶部会出现网址：`https://<你的用户名>.github.io/dayscan/`

### 方式 B：命令行

```bash
cd dayscan
git init -b main
git add .
git commit -m "Initial commit: DayScan"
git remote add origin https://github.com/<你的用户名>/dayscan.git
git push -u origin main
```
然后同样去 Settings → Pages 开启。

## 二、安装到手机

先用手机浏览器打开上面的网址（必须是 https，GitHub Pages 自带）。

**Android（Chrome）**：右上角 ⋮ → **安装应用** / **添加到主屏幕**。

**iPhone（Safari，必须用 Safari）**：底部分享按钮 → **添加到主屏幕** → 添加。

安装后从桌面图标打开，会是无地址栏的全屏应用。

## 三、API Key（重要）

- 仓库是公开的，**不要把 Key 写进 `index.html` 再提交**，否则任何人都能看到并耗尽你的额度。
- 推荐做法：保持代码里的 `YOUR_FMP_API_KEY` 不动，在手机上打开应用 → 右上角 **🔑 API Key** → 粘贴并保存。Key 只存在这台手机浏览器的本地存储里。
- 注意：浏览器版网页和「主屏幕安装版」的本地存储在 iOS 上是分开的，装好之后需要在安装版里再输入一次 Key。

## 四、更新应用

1. 修改 `index.html`（或其他文件）并提交到 GitHub。
2. 同时把 `sw.js` 第一处的 `const VERSION = 'dayscan-v1'` 改成 `v2`、`v3`……，否则手机会继续使用旧缓存。
3. 手机上完全关闭应用再打开一次，必要时再重开一次即可看到新版本。

## 五、使用提醒

- 默认是**测试模式**（模拟数据，不耗额度）。右上角开关切到「真实 API」才会消耗 FMP 请求。
- 不会自动轮询；只有点「手动刷新」和点击个股时才会请求。
- 本工具的点差、限价区间均为示意，非投资建议。
