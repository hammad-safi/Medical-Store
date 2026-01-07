// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { AuthProvider } from "./context/authContext";
// // import Layout from "@/components/layout";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "PharmaStock - Pharmacy Management",
//   description: "Complete pharmacy inventory management system",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <AuthProvider>
//           {children}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

// 'use client'; // This must be a client component for React Query

// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { AuthProvider } from "./context/authContext";
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// // Create a client
// const queryClient = new QueryClient();

// const inter = Inter({ subsets: ["latin"] });

// // export const metadata: Metadata = {
// //   title: "PharmaStock - Pharmacy Management",
// //   description: "Complete pharmacy inventory management system",
// // };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <QueryClientProvider client={queryClient}>
//           <AuthProvider>
//             {children}
//           </AuthProvider>
//         </QueryClientProvider>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PharmaStock - Pharmacy Management",
  description: "Complete pharmacy inventory management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
