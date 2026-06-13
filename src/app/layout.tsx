import type { Metadata } from "next";
import { DM_Sans, Bebas_Neue } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { CartProvider } from "@/contexts/CartContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { getSiteSettings } from "@/lib/settings/site-settings";
import { siteConfig } from "@/config/site";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "burger",
    "aramoun",
    "lebanon",
    "angus burger",
    "nashville chicken",
    "whatsapp order",
  ],
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${dmSans.variable} ${bebasNeue.variable}`}>
      <body className="min-h-screen font-sans">
        <SettingsProvider settings={settings}>
          <CartProvider>
            <SiteChrome>{children}</SiteChrome>
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
