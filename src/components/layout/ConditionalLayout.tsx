'use client';

import { usePathname } from 'next/navigation';
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';

/**
 * Conditional Header Component
 * Only renders the main app header when not on admin routes
 */
export function ConditionalHeader() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  if (isAdminRoute) {
    return null;
  }

  return (
    <Header
      showSearch={true}
      showNotifications={true}
      showUserMenu={true}
    />
  );
}

/**
 * Conditional Footer Component
 * Only renders the footer when not on admin routes
 */
export function ConditionalFooter() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  if (isAdminRoute) {
    return null;
  }

  return <Footer />;
}