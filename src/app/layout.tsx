import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { DM_Sans, Bebas_Neue } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { CartProvider } from "@/contexts/CartContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { getSiteSettings } from "@/lib/settings/site-settings";
import { buildRootMetadata } from "@/lib/settings/metadata";
import { SPLASH_STORAGE_KEY } from "@/lib/splash";
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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildRootMetadata(settings);
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
        <Script id="splash-preflight" strategy="beforeInteractive">
          {`try{if(sessionStorage.getItem("${SPLASH_STORAGE_KEY}")){document.documentElement.classList.add("splash-seen");}}catch(e){}`}
        </Script>
        <MotionProvider>
          <SettingsProvider settings={settings}>
            <CartProvider>
              <div id="app-root">
                <SiteChrome>{children}</SiteChrome>
              </div>
            </CartProvider>
          </SettingsProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
