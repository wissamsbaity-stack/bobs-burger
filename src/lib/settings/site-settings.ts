import { createServerClient } from "@/lib/supabase/server";
import type { SiteSettingsRow, OpeningHour } from "@/lib/supabase/types";
import { restaurantInfo } from "@/data/restaurant";
import { siteConfig } from "@/config/site";

export interface PublicSiteSettings {
  name: string;
  legalName: string;
  tagline: string;
  phone: string;
  phoneSecondary: string;
  email: string;
  whatsapp: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  hours: OpeningHour[];
  deliveryFee: number;
  minOrder: number;
  social: {
    instagram: string;
    facebook: string;
  };
  branding: {
    logo: string;
    heroImage: string;
  };
  metaDescription: string;
  siteUrl: string;
}

function fromStatic(): PublicSiteSettings {
  return {
    name: restaurantInfo.name,
    legalName: restaurantInfo.legalName,
    tagline: restaurantInfo.tagline,
    phone: restaurantInfo.phone,
    phoneSecondary: restaurantInfo.phoneSecondary,
    email: restaurantInfo.email,
    whatsapp: restaurantInfo.whatsapp,
    address: { ...restaurantInfo.address, state: restaurantInfo.address.state },
    hours: [...restaurantInfo.hours],
    deliveryFee: siteConfig.deliveryFee,
    minOrder: siteConfig.minOrder,
    social: { ...restaurantInfo.social },
    branding: { logo: restaurantInfo.branding.logo, heroImage: "" },
    metaDescription: siteConfig.description,
    siteUrl: siteConfig.url,
  };
}

function mapRow(row: SiteSettingsRow): PublicSiteSettings {
  return {
    name: row.restaurant_name,
    legalName: row.legal_name ?? restaurantInfo.legalName,
    tagline: row.tagline ?? "",
    phone: row.phone_primary ?? "",
    phoneSecondary: row.phone_secondary ?? "",
    email: row.email ?? "",
    whatsapp: row.whatsapp_phone,
    address: {
      street: row.address_street ?? "",
      city: row.address_city ?? "",
      state: row.address_state ?? "",
      country: row.address_country ?? "Lebanon",
    },
    hours: (row.opening_hours as OpeningHour[]) ?? [],
    deliveryFee: Number(row.delivery_fee),
    minOrder: Number(row.min_order),
    social: {
      instagram: row.instagram_url ?? "",
      facebook: row.facebook_url ?? "",
    },
    branding: {
      logo: row.logo_url ?? restaurantInfo.branding.logo,
      heroImage: row.hero_image_url ?? "",
    },
    metaDescription: row.meta_description ?? siteConfig.description,
    siteUrl: row.site_url ?? siteConfig.url,
  };
}

export async function getSiteSettings(): Promise<PublicSiteSettings> {
  const supabase = await createServerClient();
  if (!supabase) return fromStatic();

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) return fromStatic();
  return mapRow(data);
}

export async function getSiteSettingsRow(): Promise<SiteSettingsRow | null> {
  const supabase = await createServerClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  return data;
}
