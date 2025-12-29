"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

export default function DebugRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading, initialized, token, user } = useAuth();

  useEffect(() => {
    console.log("=== DEBUG REDIRECT INFO ===");
    console.log("📍 Current path:", pathname);
    console.log("🔐 Auth state - isAuthenticated:", isAuthenticated);
    console.log("⏳ Loading:", loading);
    console.log("✅ Initialized:", initialized);
    console.log("🔑 Token exists:", !!token);
    console.log("👤 User exists:", !!user);
    console.log("🏠 LocalStorage - accessToken:", localStorage.getItem("accessToken"));
    console.log("🏠 LocalStorage - pharma_token:", localStorage.getItem("pharma_token"));
    console.log("🏠 LocalStorage - pharma_user:", localStorage.getItem("pharma_user"));
    console.log("===========================");
  }, [pathname, isAuthenticated, loading, initialized, token, user]);

  // Track router actions
  useEffect(() => {
    const originalPush = router.push;
    
    // Override router.push to log redirects
    router.push = function(...args) {
      console.log("🔄 ROUTER.push called with args:", args);
      console.trace("Router.push stack trace");
      return originalPush.apply(this, args);
    };

    return () => {
      router.push = originalPush;
    };
  }, [router]);

  return null; // This component doesn't render anything
}