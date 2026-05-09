import { defaultLocale, locales } from '@/routing';

const DEFAULT_LOGIN_NEXT = '/dashboard';

function getAllowedExternalHosts(): Set<string> {
  const fromEnv = (process.env.NEXT_PUBLIC_LOGIN_REDIRECT_ALLOWLIST || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return new Set(['report.motaiot.com', ...fromEnv]);
}

export function resolveLoginNextTarget(rawNext: string | null | undefined): string {
  if (!rawNext) return DEFAULT_LOGIN_NEXT;

  const value = rawNext.trim();
  if (!value) return DEFAULT_LOGIN_NEXT;

  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      const parsed = new URL(value);
      if (parsed.protocol !== 'https:') return DEFAULT_LOGIN_NEXT;
      if (!getAllowedExternalHosts().has(parsed.hostname.toLowerCase())) {
        return DEFAULT_LOGIN_NEXT;
      }
      return parsed.toString();
    } catch {
      return DEFAULT_LOGIN_NEXT;
    }
  }

  if (value.startsWith('/')) return value;
  return `/${value}`;
}

export function isExternalLoginNextTarget(target: string): boolean {
  return target.startsWith('http://') || target.startsWith('https://');
}

export function localizeInternalPath(target: string, localeFromCookie?: string): string {
  const locale = locales.includes(localeFromCookie || '')
    ? (localeFromCookie as string)
    : defaultLocale;

  if (!target.startsWith('/')) {
    return `/${locale}/${target}`;
  }

  const pathWithoutFirstSlash = target.slice(1);
  const hasLocalePrefix = locales.some(
    (candidate) => pathWithoutFirstSlash === candidate || pathWithoutFirstSlash.startsWith(`${candidate}/`)
  );

  return hasLocalePrefix ? target : `/${locale}${target}`;
}
