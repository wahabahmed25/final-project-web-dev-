import type { Metadata } from "next";
import "./globals.css";
import { Caveat } from "next/font/google";
import Navbar from "@/components/NavBar";
import CorkboardDeco from "@/components/CorkboardDeco";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hunter Recommendations Hub",
  description:
    "A student-focused recommendations hub for places and resources on or near Hunter College.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={caveat.variable}>
        <CorkboardDeco />
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
