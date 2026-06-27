"use client";

import { m } from "@/lib/motion";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/icons/BrandIcons";
import { useSettings } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";

const SOCIAL_ICON_SIZE = 28;

export function HeroSocialLinks() {
  const settings = useSettings();

  const links = [
    {
      label: "Instagram",
      url: settings.social.instagram,
      Icon: InstagramIcon,
    },
    {
      label: "Facebook",
      url: settings.social.facebook,
      Icon: FacebookIcon,
    },
    {
      label: "TikTok",
      url: settings.social.tiktok,
      Icon: TikTokIcon,
    },
  ].filter((item) => item.url?.trim());

  if (links.length === 0) return null;

  return (
    <m.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.08 }}
      aria-label="Social media"
      className="mt-6 flex items-center justify-center gap-8 sm:mt-7 sm:gap-9"
    >
      {links.map(({ label, url, Icon }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow us on ${label}`}
          className={cn(
            "text-white/90 transition-[opacity,transform] duration-200 ease-out",
            "motion-safe:hover:opacity-100 motion-safe:hover:scale-[1.06]",
            "motion-safe:active:scale-[0.96] motion-safe:active:opacity-80"
          )}
        >
          <Icon size={SOCIAL_ICON_SIZE} />
        </a>
      ))}
    </m.nav>
  );
}
