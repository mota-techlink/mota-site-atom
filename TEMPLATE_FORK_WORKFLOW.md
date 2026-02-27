# Template Fork Workflow (方案A)

本仓库定位为“功能模板仓库（Template Repo）”，用于孵化功能、修复问题，再通过 fork 同步到正式项目。

## 目标

- 功能代码稳定迭代：放在 `src/`
- 内容可独立替换：放在 `content/` + `public/`
- 多语言内容独立维护：放在 `content/locales/`

## 目录约定（当前已落地）

- `content/site/i18n.yml`: 语言配置唯一真相源
- `content/locales/*.json`: 多语言文案唯一真相源
- `content/site/nav.yml`: 导航结构配置
- `content/site/docs-nav.yml`: 文档侧栏结构
- `content/site/features.yml`: 首页 Features 结构
- `content/site/site.yml`: 站点品牌与对外展示信息
- `content/site/menu.yml`: Dashboard/Admin 菜单结构配置

校验脚本会自动生成运行时产物到 `src/generated/content-config/*.json`（请勿手改）。

`src/config/*` 现在作为“适配层”，不再存放核心内容数据。

## 建议分支策略

### 模板仓库（本仓库）

- `main`: 模板稳定分支（可被各正式项目同步）
- `feature/*`: 新功能开发
- `fix/*`: 缺陷修复

### 正式项目（fork 后）

- 保持 upstream 指向模板仓库
- 定期同步模板功能，不覆盖自身内容

```bash
git remote add upstream <template-repo-url>
git fetch upstream
git checkout main
git merge upstream/main
```

## 内容替换流程（正式项目）

1. 替换 `content/` 下业务内容（文档、产品、多语言）
2. 替换 `public/` 下品牌资源（logo、图、视频）
3. 保留 `src/` 功能层，避免与模板功能分叉冲突

## 冲突最小化建议

- 不在正式项目里直接修改 `src/config/*` 结构
- 将业务文本全部移到 `content/locales/`
- 将导航和站点信息修改集中在 `content/site/*`

## 新增页面内容规范

新增页面（如 about/contact/后续 portal 页面）请统一遵循：

1. 在 `content/site/*.yml` 建立页面配置（至少包含 `metadata.titleKey` 和 `metadata.descriptionKey`）
2. 页面 UI 文案只引用翻译 key，不写死文本
3. 页面 metadata 使用统一 helper：`src/lib/page-metadata.ts`
4. 翻译只写入 `content/locales/*.json`
5. 提交前执行 `npm run content:validate`，确保 schema 与翻译 key 都通过

## 提交前防护（已内置）

- 内容 Schema 校验：`npm run content:validate`
- 模板检查：`npm run check:template`

如需启用 git 提交前自动校验（pre-commit）：

```bash
npm run hooks:install
```

启用后，每次提交会自动执行 `content:validate`，优先拦截：

- 缺失 locale 文件
- locale key 不一致
- `content/site/*` 配置结构错误

## Cloudflare Pages 部署注意

- 构建链路已使用 `node scripts/*.mjs` 直接执行关键脚本，避免嵌套 `npm run` 带来的不确定性。
- 推荐 Pages Build command 使用：`npm run pages:build`
- 若只生成数据清单可使用：`npm run build:data`
