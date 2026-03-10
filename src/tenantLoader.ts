/**
 * Tenant resolution — determines which tenant config to load.
 *
 * Resolution order:
 *   1. Subdomain:   agency-a.yourtool.com  → slug "agency-a"
 *   2. Query param: yourtool.com?tenant=agency-a → slug "agency-a"
 *
 * Path-based routing (/agency-a) is intentionally omitted because it
 * conflicts with the SPA's own routes (summary, methodology, etc.).
 *
 * For subdomain support in production, configure a wildcard CNAME
 * (*.yourtool.com → your hosting provider) and ensure your deployment
 * serves the same SPA for all subdomains.
 */

const VALID_SLUG = /^[a-z0-9][a-z0-9_-]*$/i;

function isValidSlug(slug: string): boolean {
  return slug.length >= 1 && slug.length <= 64 && VALID_SLUG.test(slug);
}

/**
 * Returns the active tenant slug, or null for the default/global config.
 */
export function getTenantSlug(): string | null {
  // 1. Subdomain detection — works for agency-a.yourtool.com
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'localhost') {
    const sub = parts[0];
    if (isValidSlug(sub)) return sub;
  }

  // 2. Query param — works for yourtool.com?tenant=agency-a
  const slug = new URLSearchParams(window.location.search).get('tenant');
  if (slug && isValidSlug(slug)) return slug;

  return null;
}

/**
 * Returns a localStorage key prefix scoped to the active tenant.
 * Prevents data from leaking between tenants on the same origin.
 *
 * Example: "acme-corp:" or "" (empty string for default).
 */
export function getTenantStoragePrefix(): string {
  const slug = getTenantSlug();
  return slug ? `${slug}:` : '';
}
