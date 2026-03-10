import type { TenantBranding } from './types';

/**
 * Injects a tenant's brand tokens into the document's CSS custom properties,
 * updates the page title, and swaps the favicon.
 *
 * Only properties that are explicitly set in the config are applied —
 * everything else falls back to the defaults defined in tokens.css.
 */
export function applyTenantTheme(branding: TenantBranding, defaultTitle: string): void {
  const root = document.documentElement;
  const theme = branding.theme;

  if (theme?.primaryColor) {
    root.style.setProperty('--color-primary', theme.primaryColor);
  }
  if (theme?.accentColor) {
    root.style.setProperty('--color-accent', theme.accentColor);
  }
  if (theme?.bgColor) {
    root.style.setProperty('--color-bg', theme.bgColor);
  }
  if (theme?.textColor) {
    root.style.setProperty('--color-text', theme.textColor);
  }
  if (theme?.sidebarBg) {
    root.style.setProperty('--color-sidebar-bg', theme.sidebarBg);
  }
  if (theme?.sidebarText) {
    root.style.setProperty('--color-sidebar-text', theme.sidebarText);
  }
  if (theme?.fontFamily) {
    root.style.setProperty('--font-family', theme.fontFamily);
  }

  // Favicon
  if (branding.faviconUrl) {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = branding.faviconUrl;
  }

  // Document title
  document.title = branding.productName ?? defaultTitle;
}
