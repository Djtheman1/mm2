import type React from "react";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "MM2 Amethyst - Next Generation Trading",
  description:
    "Experience the future of MM2 trading with our advanced platform",
  keywords:
    "MM2, Murder Mystery 2, trading, Roblox, knives, guns, collectibles",
  authors: [{ name: "MM2 Amethyst Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mm2amethyst.com",
    title: "MM2 Amethyst - Next Generation Trading",
    description:
      "Experience the future of MM2 trading with our advanced platform",
    siteName: "MM2 Amethyst",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
            <div className="floating-gems" aria-hidden="true">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="floating-gem"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${20 + Math.random() * 10}s`,
                  }}
                />
              ))}
            </div>
            <div className="noise-overlay" aria-hidden="true" />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
