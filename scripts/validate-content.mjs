import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';
import { z } from 'zod';

const ROOT = process.cwd();
const LOCALES_DIR = path.join(ROOT, 'content', 'locales');
const GENERATED_CONFIG_DIR = path.join(ROOT, 'src', 'generated', 'content-config');

const ICON_NAMES = [
  'dashboard',
  'settings',
  'users',
  'logs',
  'video',
  'eye',
  'newspaper',
  'orderList',
  'presentation',
  'x402',
];

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

const menuSchema = z.object({
  userNavItems: z.array(
    z.object({
      titleKey: z.string().min(1),
      href: z.string().min(1),
      icon: z.enum(ICON_NAMES),
    })
  ),
  adminNavItems: z.array(
    z.object({
      titleKey: z.string().min(1),
      href: z.string().min(1),
      icon: z.enum(ICON_NAMES),
    })
  ),
});

const aboutSchema = z.object({
  metadata: z.object({
    titleKey: z.string().min(1),
    descriptionKey: z.string().min(1),
  }),
  hero: z.object({
    titlePrefixKey: z.string().min(1),
    titleHighlight: z.string().min(1),
    subtitleKey: z.string().min(1),
  }),
  story: z.object({
    titleKey: z.string().min(1),
    paragraphs: z.array(z.string().min(1)).min(1),
  }),
  stats: z.array(
    z.object({
      value: z.string().min(1),
      labelKey: z.string().min(1),
    })
  ).min(1),
});

const contactSchema = z.object({
  metadata: z.object({
    titleKey: z.string().min(1),
    descriptionKey: z.string().min(1),
  }),
  hero: z.object({
    titleKey: z.string().min(1),
    subtitleKey: z.string().min(1),
  }),
  info: z.object({
    phoneLabelKey: z.string().min(1),
    officeLabelKey: z.string().min(1),
    emailLabelKey: z.string().min(1),
  }),
  success: z.object({
    titleKey: z.string().min(1),
    subtitleKey: z.string().min(1),
    ctaKey: z.string().min(1),
  }),
  form: z.object({
    firstNameLabelKey: z.string().min(1),
    firstNamePlaceholderKey: z.string().min(1),
    lastNameLabelKey: z.string().min(1),
    lastNamePlaceholderKey: z.string().min(1),
    emailLabelKey: z.string().min(1),
    emailPlaceholderKey: z.string().min(1),
    messageLabelKey: z.string().min(1),
    messagePlaceholderKey: z.string().min(1),
    sendKey: z.string().min(1),
    sendingKey: z.string().min(1),
  }),
});

function readYaml(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  const raw = fs.readFileSync(absolutePath, 'utf-8');
  const parsed = load(raw);

  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`${relativePath} must be a valid YAML object`);
  }

  return parsed;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeGeneratedJson(fileName, value) {
  if (!fs.existsSync(GENERATED_CONFIG_DIR)) {
    fs.mkdirSync(GENERATED_CONFIG_DIR, { recursive: true });
  }

  const outputPath = path.join(GENERATED_CONFIG_DIR, fileName);
  fs.writeFileSync(outputPath, `${JSON.stringify(value, null, 2)}\n`);
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

  const defaultMessages = readJson(defaultPath);
  const defaultKeys = flattenMessageKeys(defaultMessages);

  for (const locale of locales) {
    const localePath = path.join(LOCALES_DIR, `${locale}.json`);
    if (!fs.existsSync(localePath)) {
      throw new Error(`Missing locale file: content/locales/${locale}.json`);
    }

    const localeMessages = readJson(localePath);
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

  return defaultKeys;
}

function assertMenuTitleKeysExist(menu, messageKeys) {
  const allItems = [...menu.userNavItems, ...menu.adminNavItems];
  const missing = allItems
    .map((item) => item.titleKey)
    .filter((titleKey) => !messageKeys.has(`Dashboard.${titleKey}`));

  if (missing.length > 0) {
    throw new Error(
      `content/site/menu.yml has unknown titleKey in Dashboard namespace (examples: ${missing.slice(0, 5).join(', ')})`
    );
  }
}

function assertNamespacedKeysExist(namespace, keys, messageKeys) {
  const missing = keys.filter((key) => !messageKeys.has(`${namespace}.${key}`));

  if (missing.length > 0) {
    throw new Error(
      `${namespace} is missing translation keys (examples: ${missing.slice(0, 5).join(', ')})`
    );
  }
}

function validate() {
  const i18n = i18nSchema.parse(readYaml('content/site/i18n.yml'));

  if (!i18n.locales.includes(i18n.defaultLocale)) {
    throw new Error('content/site/i18n.yml: defaultLocale must exist in locales');
  }

  if (new Set(i18n.locales).size !== i18n.locales.length) {
    throw new Error('content/site/i18n.yml: locales must be unique');
  }

  const site = siteSchema.parse(readYaml('content/site/site.yml'));
  const nav = navSchema.parse(readYaml('content/site/nav.yml'));
  const docsNav = docsNavSchema.parse(readYaml('content/site/docs-nav.yml'));
  const features = featuresSchema.parse(readYaml('content/site/features.yml'));
  const menu = menuSchema.parse(readYaml('content/site/menu.yml'));
  const about = aboutSchema.parse(readYaml('content/site/about.yml'));
  const contact = contactSchema.parse(readYaml('content/site/contact.yml'));

  const defaultMessageKeys = assertLocaleKeyParity(i18n.locales, i18n.defaultLocale);
  assertMenuTitleKeysExist(menu, defaultMessageKeys);

  assertNamespacedKeysExist(
    'AboutPage',
    [
      about.metadata.titleKey,
      about.metadata.descriptionKey,
      about.hero.titlePrefixKey,
      about.hero.subtitleKey,
      about.story.titleKey,
      ...about.story.paragraphs,
      ...about.stats.map((item) => item.labelKey),
    ],
    defaultMessageKeys
  );

  assertNamespacedKeysExist(
    'ContactPage',
    [
      contact.metadata.titleKey,
      contact.metadata.descriptionKey,
      contact.hero.titleKey,
      contact.hero.subtitleKey,
      contact.info.phoneLabelKey,
      contact.info.officeLabelKey,
      contact.info.emailLabelKey,
      contact.success.titleKey,
      contact.success.subtitleKey,
      contact.success.ctaKey,
      contact.form.firstNameLabelKey,
      contact.form.firstNamePlaceholderKey,
      contact.form.lastNameLabelKey,
      contact.form.lastNamePlaceholderKey,
      contact.form.emailLabelKey,
      contact.form.emailPlaceholderKey,
      contact.form.messageLabelKey,
      contact.form.messagePlaceholderKey,
      contact.form.sendKey,
      contact.form.sendingKey,
    ],
    defaultMessageKeys
  );

  writeGeneratedJson('i18n.json', i18n);
  writeGeneratedJson('site.json', site);
  writeGeneratedJson('nav.json', nav);
  writeGeneratedJson('docs-nav.json', docsNav);
  writeGeneratedJson('features.json', features);
  writeGeneratedJson('menu.json', menu);
  writeGeneratedJson('about.json', about);
  writeGeneratedJson('contact.json', contact);
}

try {
  validate();
  console.log('✅ content validation passed');
  console.log(`✅ generated config artifacts at ${path.relative(ROOT, GENERATED_CONFIG_DIR)}`);
} catch (error) {
  console.error('❌ content validation failed');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
