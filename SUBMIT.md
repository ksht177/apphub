# 上传者指南：如何把你的软件放进 AppHub

## 第一步：准备 Release

1. 在**你自己的 GitHub 仓库**发布一个 Release（Releases → Create a new release）
2. 上传你的安装包，**文件名固定下来，以后永远别改**，例如：
   - `app-release.apk`（Android）
   - `app-setup.exe`（Windows）
3. 以后每次更新：发新 Release，**资产文件名保持完全一致**。商店链接永远指向最新版，无需通知任何人。

> 为什么文件名要固定？因为商店用的是 GitHub 的"最新版直链"：
> `https://github.com/你的用户名/仓库名/releases/latest/download/app-release.apk`
> 文件名变了链接就失效了。

## 第二步：申请上架

到 AppHub 仓库提 Issue，选「上架申请」模板，填写：

| 字段 | 说明 |
|---|---|
| name | 应用显示名 |
| repo | 你的仓库，格式 `用户名/仓库名` |
| asset | Release 里的文件名（第一步固定好的那个） |
| desc | 一句话简介 |
| tags | 分类标签，如 工具 / 影音 / 开发 |
| platform | android / windows / linux / macos |
| icon | 图标直链（可选，建议放你仓库里用 raw 链接） |
| sha256 | 安装包的哈希（可选但强烈建议） |

管理员审核通过后会把你的条目加进 `catalog.json`，即刻在商店可见。

## 规则

1. 不得上传恶意软件、木马、盗版破解
2. 软件内容必须合法合规
3. 违规条目会被直接移除，不另行通知
