import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const ROOT = process.cwd();
const SITE_DIR = path.join(ROOT, 'content', 'site');
const LOCALES_DIR = path.join(ROOT, 'content', 'locales');

const i18nSchema = z.object({
  locales: z.array(z.string().min(1)).min(1),
  defaultLocale: z.string().min(1),
});

const oauthProviderSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().min(1),
  enable: z.boolean(),
});

const siteSchema = z.object({
  name: z.string().min(1),
  logoLight: z.string().min(1),
  logoDark: z.string().min(1),
  Icon: z.string().min(1),
  logo: z.string().min(1),
  banner: z.string().min(1),
  description: z.string().min(1),
  contact: z.object({
    email: z.string().min(1),
    toMail: z.string().min(1),
    phone: z.string().min(1),
    address: z.string().min(1),
  }),
  google_map: z.object({
    mapCoordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    mapEnable: z.boolean(),
    mapZoom: z.number(),
    mapMarker: z.string().min(1),
    mapURL: z.string().min(1),
  }),
  links: z.object({
    twitter: z.string().min(1),
    github: z.string().min(1),
  }),
  features: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    })
  ),
  oauth: z.object({
    common: z.array(oauthProviderSchema),
    regionSpecific: z.record(z.string(), z.array(oauthProviderSchema)),
  }),
});

const navSchema = z.array(
  z.object({
    title: z.string().min(1),
    items: z.array(
      z.object({
        title: z.string().min(1),
        href: z.string().min(1),
        description: z.string().optional(),
        featured: z.boolean().optional(),
      })
    ),
  })
);

const docsNavSchema = z.array(
  z.object({
    titleKey: z.string().min(1),
    items: z.array(
      z.object({
        titleKey: z.string().min(1),
        href: z.string().min(1),
      })
    ),
  })
);

const featuresSchema = z.object({
  titleKey: z.string().min(1),
  subtitleKey: z.string().min(1),
  features: z.array(
    z.object({
      titleKey: z.string().min(1),
      descriptionKey: z.string().min(1),
      icon: z.string().min(1),
    })
  ),
});

function readJson(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  const raw = fs.readFileSync(absolutePath, 'utf-8');
  return JSON.parse(raw);
}

function flattenMessageKeys(node, prefix = '', output = new Set()) {
  if (node && typeof node === 'object' && !Array.isArray(node)) {
    for (const [key, value] of Object.entries(node)) {
      const next = prefix ? `${prefix}.${key}` : key;
      flattenMessageKeys(value, next, output);
    }
    return output;
  }

  output.add(prefix);
  return output;
}

function assertLocaleKeyParity(locales, defaultLocale) {
  const defaultPath = path.join(LOCALES_DIR, `${defaultLocale}.json`);
  if (!fs.existsSync(defaultPath)) {
    throw new Error(`Missing default locale file: content/locales/${defaultLocale}.json`);
  }

  const defaultMessages = JSON.parse(fs.readFileSync(defaultPath, 'utf-8'));
  const defaultKeys = flattenMessageKeys(defaultMessages);

  for (const locale of locales) {
    const localePath = path.join(LOCALES_DIR, `${locale}.json`);
    if (!fs.existsSync(localePath)) {
      throw new Error(`Missing locale file: content/locales/${locale}.json`);
    }

    const localeMessages = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
    const localeKeys = flattenMessageKeys(localeMessages);

    const missingKeys = [...defaultKeys].filter((key) => !localeKeys.has(key));
    const extraKeys = [...localeKeys].filter((key) => !defaultKeys.has(key));

    if (missingKeys.length > 0) {
      throw new Error(
        `Locale ${locale} is missing ${missingKeys.length} keys (examples: ${missingKeys.slice(0, 5).join(', ')})`
      );
    }

    if (extraKeys.length > 0) {
      throw new Error(
        `Locale ${locale} has ${extraKeys.length} extra keys (examples: ${extraKeys.slice(0, 5).join(', ')})`
      );
    }
  }
}

function validate() {
  const i18n = i18nSchema.parse(readJson('content/site/i18n.json'));

  if (!i18n.locales.includes(i18n.defaultLocale)) {
    throw new Error('content/site/i18n.json: defaultLocale must exist in locales');
  }

  if (new Set(i18n.locales).size !== i18n.locales.length) {
    throw new Error('content/site/i18n.json: locales must be unique');
  }

  siteSchema.parse(readJson('content/site/site.json'));
  navSchema.parse(readJson('content/site/nav.json'));
  docsNavSchema.parse(readJson('content/site/docs-nav.json'));
  featuresSchema.parse(readJson('content/site/features.json'));

  assertLocaleKeyParity(i18n.locales, i18n.defaultLocale);
}

try {
  validate();
  console.log('✅ content validation passed');
} catch (error) {
  console.error('❌ content validation failed');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
