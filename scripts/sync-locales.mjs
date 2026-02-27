import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const args = new Set(process.argv.slice(2));
const shouldWrite = args.has('--write');
const shouldCheck = args.has('--check');

const i18nPath = path.join(ROOT, 'content/site/i18n.json');
const sourceDir = path.join(ROOT, 'src/messages');
const targetDir = path.join(ROOT, 'content/locales');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function flattenKeys(node, prefix = '', output = new Set()) {
  if (node && typeof node === 'object' && !Array.isArray(node)) {
    for (const [key, value] of Object.entries(node)) {
      const next = prefix ? `${prefix}.${key}` : key;
      flattenKeys(value, next, output);
    }
    return output;
  }

  output.add(prefix);
  return output;
}

function ensureFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${path.relative(ROOT, filePath)}`);
  }
}

function main() {
  ensureFile(i18nPath);
  const i18n = readJson(i18nPath);
  const locales = i18n.locales || [];

  if (!Array.isArray(locales) || locales.length === 0) {
    throw new Error('content/site/i18n.json has no locales');
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let hasMismatch = false;

  for (const locale of locales) {
    const sourcePath = path.join(sourceDir, `${locale}.json`);
    const targetPath = path.join(targetDir, `${locale}.json`);

    ensureFile(sourcePath);

    const sourceJson = readJson(sourcePath);
    const sourceKeys = flattenKeys(sourceJson);

    let targetJson = {};
    let targetKeys = new Set();

    if (fs.existsSync(targetPath)) {
      targetJson = readJson(targetPath);
      targetKeys = flattenKeys(targetJson);
    }

    const missingInTarget = [...sourceKeys].filter((key) => !targetKeys.has(key));
    const extraInTarget = [...targetKeys].filter((key) => !sourceKeys.has(key));

    const isSame =
      missingInTarget.length === 0 &&
      extraInTarget.length === 0 &&
      JSON.stringify(sourceJson) === JSON.stringify(targetJson);

    if (!isSame) {
      hasMismatch = true;
    }

    console.log(`\n[${locale}]`);
    console.log(`- source keys: ${sourceKeys.size}`);
    console.log(`- target keys: ${targetKeys.size}`);

    if (missingInTarget.length > 0) {
      console.log(`- missing in target: ${missingInTarget.length} (e.g. ${missingInTarget.slice(0, 5).join(', ')})`);
    }

    if (extraInTarget.length > 0) {
      console.log(`- extra in target: ${extraInTarget.length} (e.g. ${extraInTarget.slice(0, 5).join(', ')})`);
    }

    if (shouldWrite) {
      fs.writeFileSync(targetPath, `${JSON.stringify(sourceJson, null, 2)}\n`);
      console.log(`- synced -> ${path.relative(ROOT, targetPath)}`);
    } else if (isSame) {
      console.log('- status: in sync');
    } else {
      console.log('- status: out of sync');
    }
  }

  if (shouldCheck && hasMismatch) {
    console.error('\n❌ locale sync check failed: content/locales differs from src/messages');
    process.exit(1);
  }

  console.log(`\n✅ locale sync ${shouldWrite ? 'write' : 'report'} completed`);
}

try {
  main();
} catch (error) {
  console.error('❌ locale sync failed');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
