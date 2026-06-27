"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { AnimatePresence, m } from "@/lib/motion";
import { useSettings } from "@/contexts/SettingsContext";
import { useAnyOverlayOpen } from "@/lib/overlay-store";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";

/** Pages where the quick-contact WhatsApp button is offered. */
const VISIBLE_ON = new Set(["/menu", "/contact"]);

export function FloatingWhatsAppButton() {
  const pathname = usePathname();
  const settings = useSettings();
  const overlayOpen = useAnyOverlayOpen();

  const show = VISIBLE_ON.has(pathname) && !overlayOpen;

  const whatsappUrl = buildWhatsAppContactUrl(
    undefined,
    settings.whatsapp,
    settings.name
  );

  return (
    <AnimatePresence>
      {show ? (
        <m.a
          key="floating-whatsapp"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-6 left-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_8px_24px_-4px_rgba(37,211,102,0.55),0_0_22px_rgba(37,211,102,0.35)] ring-1 ring-whatsapp/40 motion-safe:transition-transform motion-safe:duration-150 motion-safe:hover:scale-105 sm:left-6"
          style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))" }}
          aria-label="Contact us on WhatsApp"
        >
          <WhatsAppIcon size={20} />
        </m.a>
      ) : null}
    </AnimatePresence>
  );
}
