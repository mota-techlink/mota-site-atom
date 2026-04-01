#!/usr/bin/env node
/**
 * sync-env-to-cf.mjs
 *
 * 将 .env.prod 中的环境变量以「普通明文」类型批量上传到 Cloudflare Pages。
 * 使用 Cloudflare REST API (PATCH /pages/projects/{name})，无需 wrangler secret。
 *
 * 用法:
 *   node scripts/sync-env-to-cf.mjs --project <cf-pages-project-name> \
 *        --account-id <cf-account-id> --api-token <cf-api-token> \
 *        [--env production|preview] [--dry-run]
 *
 * 也可以通过环境变量传入凭证（避免明文出现在命令行历史）:
 *   CLOUDFLARE_ACCOUNT_ID=xxx CLOUDFLARE_API_TOKEN=xxx \
 *     node scripts/sync-env-to-cf.mjs --project <project-name>
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── 本地开发专用变量，不需要上传到 CF ───────────────────────────────────────
const EXCLUDE_KEYS = new Set([
  "NEXT_PUBLIC_BASE_URL", // CF Pages 会自动注入真实域名
]);

// ── 解析命令行参数 ────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
};
const hasFlag = (flag) => args.includes(flag);

const projectName = getArg("--project");
const environment  = getArg("--env") ?? "production";
const dryRun       = hasFlag("--dry-run");

// 凭证：优先读命令行参数，回退到环境变量
const accountId = getArg("--account-id") ?? process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken  = getArg("--api-token")  ?? process.env.CLOUDFLARE_API_TOKEN;

if (!projectName) {
  console.error("❌  请指定 Cloudflare Pages 项目名称:");
  console.error("    node scripts/sync-env-to-cf.mjs --project <project-name> --account-id <id> --api-token <token>");
  console.error("    或设置环境变量 CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN 后省略对应参数");
  process.exit(1);
}
if (!accountId || !apiToken) {
  console.error("❌  缺少 Cloudflare 凭证，请通过 --account-id / --api-token 或同名环境变量传入。");
  process.exit(1);
}

// ── 读取并解析 .env.prod ──────────────────────────────────────────────────────
const envFile = resolve(ROOT, ".env.prod");
if (!existsSync(envFile)) {
  console.error(`❌  找不到 ${envFile}`);
  console.error("    请先复制 .env.local → .env.prod 并填入生产环境的值");
  process.exit(1);
}

const lines  = readFileSync(envFile, "utf8").split("\n");
const envMap = {};

for (const raw of lines) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;

  const eqIdx = line.indexOf("=");
  if (eqIdx === -1) continue;

  const key = line.slice(0, eqIdx).trim();
  let value  = line.slice(eqIdx + 1).replace(/#.*$/, "").trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  if (EXCLUDE_KEYS.has(key)) {
    console.log(`⏭️  跳过 (excluded): ${key}`);
    continue;
  }

  envMap[key] = value;
}

const count = Object.keys(envMap).length;
console.log(`\n📦  共解析到 ${count} 个环境变量`);
console.log(`🎯  目标项目: ${projectName}  |  环境: ${environment}  |  类型: 普通明文`);

if (count === 0) {
  console.log("⚠️  没有可上传的变量，退出。");
  process.exit(0);
}

// ── 预览要上传的变量（隐藏值）────────────────────────────────────────────────
console.log("\n变量列表:");
for (const key of Object.keys(envMap)) {
  const preview = envMap[key].length > 6 ? envMap[key].slice(0, 4) + "****" : "****";
  console.log(`  ${key.padEnd(45)} = ${preview}`);
}

if (dryRun) {
  console.log("\n✅  [dry-run] 以上变量将被上传，实际未执行。");
  process.exit(0);
}

// ── 构造 Cloudflare API 请求体 ────────────────────────────────────────────────
// 普通明文环境变量：{ "value": "..." }（不含 type 字段即为明文）
const envVars = {};
for (const [key, value] of Object.entries(envMap)) {
  envVars[key] = { value };
}

const deploymentEnv = environment === "preview" ? "preview" : "production";
const body = {
  deployment_configs: {
    [deploymentEnv]: {
      env_vars: envVars,
    },
  },
};

// ── 调用 Cloudflare REST API ──────────────────────────────────────────────────
const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`;
console.log(`\n🚀  PATCH ${url}\n`);

const response = await fetch(url, {
  method: "PATCH",
  headers: {
    "Authorization": `Bearer ${apiToken}`,
    "Content-Type":  "application/json",
  },
  body: JSON.stringify(body),
});

const result = await response.json();

if (!response.ok || !result.success) {
  console.error("❌  上传失败:");
  console.error(JSON.stringify(result.errors ?? result, null, 2));
  process.exit(1);
}

console.log(`✅  成功将 ${count} 个普通环境变量上传到 Cloudflare Pages [${environment}]！`);
