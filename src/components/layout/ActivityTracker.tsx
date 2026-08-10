'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/storeContext';

export default function ActivityTracker() {
  const pathname = usePathname();
  const { currentUser } = useStore();
  const prevEmailRef = useRef<string | null>(null);

  useEffect(() => {
    if (!currentUser || !currentUser.email || currentUser.role === 'admin') {
      // If user logged out after being logged in
      if (prevEmailRef.current) {
        fetch('/api/user/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: prevEmailRef.current, action: 'logout' }),
        }).catch(() => {});
        prevEmailRef.current = null;
      }
      return;
    }

    prevEmailRef.current = currentUser.email;

    const sendHeartbeat = () => {
      fetch('/api/user/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          name: currentUser.name,
          currentPage: pathname || '/',
        }),
      }).catch(() => {});
    };

    // Send immediate heartbeat on route / user change
    sendHeartbeat();

    // Set 10s periodic heartbeat interval
    const interval = setInterval(sendHeartbeat, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [pathname, currentUser]);

  return null;
}
