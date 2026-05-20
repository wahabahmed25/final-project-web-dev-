import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/NavBar";
import { AuthProvider } from "@/context/AuthContext";
import { Providers } from "./providers";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}