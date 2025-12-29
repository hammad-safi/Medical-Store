import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/authContext";
// import Layout from "@/components/layout";

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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}