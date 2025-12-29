// "use client";

// import { useState } from "react";
// import Sidebar from "@/components/layout/Sidebar";
// import Header from "@/components/layout/Header";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar
//         isOpen={sidebarOpen}
//         collapsed={collapsed}
//         onToggle={() => setCollapsed(!collapsed)}
//         onClose={() => setSidebarOpen(false)}
//       />

//       <div className="flex flex-col flex-1">
//         <Header onMenuClick={() => setSidebarOpen(true)} />
//         <main className="flex-1 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useAuth } from "@/app/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, loading, initialized, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("🔒 DashboardLayout: Auth check");
    console.log("📊 Auth state - isAuthenticated:", isAuthenticated, "loading:", loading, "initialized:", initialized);
    
    // Only redirect after initialization
    if (initialized && !loading && !isAuthenticated) {
      console.log("🚫 DashboardLayout: Not authenticated, redirecting to login");
      router.push("/login");
    }
  }, [isAuthenticated, loading, initialized, router]);

  // Show loading while checking
  if (loading || !initialized) {
    console.log("⏳ DashboardLayout: Loading auth state...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    console.log("❌ DashboardLayout: Not authenticated");
    return null;
  }

  console.log("✅ DashboardLayout: User authenticated, rendering layout");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}