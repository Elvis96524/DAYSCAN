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

## 五、语言切换

- 页面右上角的 **🌐** 下拉框可在 **中文 / English** 之间切换，选择会记在本机浏览器里，下次自动沿用。
- 首次打开时按手机系统语言自动选择（中文系统 → 中文，其他 → English）。
- 想加新语言（如马来语）：在 `index.html` 的 `I18N` 对象里复制 `en` 那一段改成新语言代码（如 `ms`），再在 `<select id="langSel">` 里加一个 `<option value="ms">`。

## 六、使用提醒

- 默认是**测试模式**（模拟数据，不耗额度）。右上角开关切到「真实 API」才会消耗 FMP 请求。
- 不会自动轮询；只有点「手动刷新」才会请求（约 3 次）。选股评分、交易计划、风控卡片全部在本机计算，不消耗额度。
- 5 分钟 K 线请求曾返回 402（通常表示当前套餐不含该数据，但具体原因未经核实），K 线图已移除，改为「建议入手」区。
- 本工具的点差、限价区间均为示意，非投资建议。

### 准确性说明
- **RVOL 按时间折算**：默认把「当前成交量 ÷ 平均成交量」按交易日已过去的时间折算（用一条常见的日内成交量 U 形曲线近似，按数据抓取时刻计算，不是按现在）。这是经验近似；盘前和开盘前 15 分钟统一按 8% 估算，仅供参考。可在左侧取消勾选改看原始比值。
- **字段需实测**：成交量、平均成交量来自 FMP `batch-quote`。如果返回里没有这些字段，页面会提示，RVOL 显示「未知」，这类股票评级最高为「可关注」。
- **点差并入风险**：「往返点差 %」是你自己填的估算（默认 0.3%，是占位假设，不是 eToro 的真实数字），请按 eToro 里看到的买卖价差调整。
- **假日**：已内置 2026 年美股休市日与提前收市日；2027 年为按规则推算，每年请对照 NYSE 官方日历核对。
- 评分权重、成交量曲线均未经历史回测，只用来排序，不预测涨跌。

## 六、电脑 ⇄ 手机 同步

应用内点右上角 **☁ 同步**。同步的内容：API 额度计数（每台设备分别累加，合计显示，所以两边看到的剩余次数一致）、筛选条件、最近一次扫描缓存（在电脑上刷新过，手机同步后可直接看，不用再耗额度）。**不会同步**：GitHub 令牌；FMP API Key 默认也不同步。

### 一次性设置
1. 打开 https://github.com/settings/tokens → 生成 **classic** 令牌，权限只勾选 **gist**，复制令牌。（fine-grained 令牌是否支持 Gist 我不确定，建议用 classic。）
2. 电脑上打开 DayScan → ☁ 同步 → 粘贴令牌 → **保存设置** → **立即同步**。第一次会自动在你的账号下创建一个私密 Gist（文件名 `dayscan-sync.json`）。
3. 手机上打开 DayScan → ☁ 同步 → 粘贴同一个令牌 → **保存设置** → **立即同步**。程序会自动找到那个 Gist，不用手填 ID。

之后每次想同步，两边各点一次「立即同步」即可（先拉取合并，再上传）。同步不消耗 FMP 额度。

### 注意
- 「私密 Gist」不是加密，知道链接的人能看到内容。所以默认不同步 API Key；如要勾选，请知晓这个风险。更稳妥的做法是在每台设备上各自输入一次 Key。
- 令牌权限很大程度等同于你的 Gist 读写权，不要截图或发给别人；怀疑泄露就到 GitHub 里删除该令牌。
- 没法联网或不想用 GitHub 时，可用「导出 JSON / 导入 JSON」手动传文件（例如发到微信文件传输助手）。
- 更新应用后记得把 `sw.js` 里的版本号加 1（目前是 `dayscan-v4`）。
