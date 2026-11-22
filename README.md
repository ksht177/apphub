# 📦 AppHub —— 基于 GitHub 的开放软件库

一个**零后端**的软件分发站：软件文件由上传者自己的 GitHub Release 托管，本仓库只维护一个索引（`catalog.json`）+ 一个静态商店页面。

## 架构

```
上传者自己的 repo ──Release(文件名固定)──┐
                                        ├─> catalog.json 索引 ──> 静态网页客户端 ──> 用户点下载
本仓库(GitHub Pages 托管页面+清单) ──────┘         │
                                                  └─> https://github.com/{repo}/releases/latest/download/{文件名}
```

- **不限流**：下载走 `releases/latest/download/` 直链，不调用 GitHub API
- **不用更新清单**：上传者发新版只要文件名不变，商店自动指向最新版
- **零成本**：Pages 托管页面免费，Release 存储免费（单文件 ≤2GB）

## 快速部署你自己的

1. Fork / 上传本仓库到你的 GitHub 账号
2. 仓库 Settings → Pages → Source 选 `main` 分支根目录
3. 等 1 分钟，访问 `https://你的用户名.github.io/仓库名/`
4. 编辑 `catalog.json`，把示例条目换成真实应用

## 别人如何上架软件

两种模式，二选一或并行：

- **Issue 申请制**（推荐，有审核）：上传者点 Issues → 「上架申请」填表，你审核后手动把条目加进 `catalog.json`
- **PR 自助制**：上传者直接 PR 修改 `catalog.json`，CI 自动校验格式（见 `.github/workflows/validate.yml`），你合并即上架

上传者侧的要求详见 [SUBMIT.md](SUBMIT.md)。

## ⚠️ 安全须知（很重要）

你分发的是**可执行文件**，责任重大：

1. 上架前务必下载检查，最好过一遍 [VirusTotal](https://www.virustotal.com)
2. 要求上传者提供 SHA256（填在清单里），客户端可校验
3. 页面已对清单内容做转义，但仍要防恶意条目（指向钓鱼网站的 homepage 等）
4. 在仓库 LICENSE / 页脚写免责声明，明确「软件由第三方上传，风险自负」

## 路线图

- [x] 静态商店页（搜索 / 标签 / 下载）
- [x] Issue 上架申请表单
- [x] PR 自动校验 CI
- [ ] 下载量统计（Badge / 第三方计数器）
- [ ] 镜像加速（jsDelivr / 自建反代，解决国内访问）
- [ ] Android 客户端（WebView 套壳或原生，读同一个 catalog.json）
- [ ] SHA256 校验 + 审核标签体系
