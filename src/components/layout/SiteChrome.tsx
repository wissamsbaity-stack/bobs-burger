"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartToastProvider } from "@/components/cart/CartToastProvider";
import { FloatingCartButton } from "@/components/cart/FloatingCartButton";
import { PageTransition } from "@/components/motion/PageTransition";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <CartDrawer />
      <CartToastProvider />
      <FloatingCartButton />
    </>
  );
}
