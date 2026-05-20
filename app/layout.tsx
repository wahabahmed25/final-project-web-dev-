import type { Metadata } from "next";
import "./globals.css";
import { Caveat } from "next/font/google";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeProvider } from "next-themes";
import CursorParticles from "@/components/CursorParticles";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hunter Recommendations Hub",
  description:
    "A student-built recommendations hub for study spots, food, coffee, bookstores, and resources on or near Hunter College.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={caveat.variable} style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ToastProvider>
              <CursorParticles />
              <Navbar />
              <main style={{ flex: 1, position: "relative", zIndex: 1 }}>{children}</main>
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
