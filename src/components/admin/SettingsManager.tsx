"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { updateSiteSettings } from "@/app/admin/(dashboard)/actions";
import type { OpeningHour, SiteSettingsRow } from "@/lib/supabase/types";
import { Plus, Trash2 } from "lucide-react";
import { SettingsImageField } from "@/components/admin/SettingsImageField";
import { ImageCropField } from "@/components/admin/ImageCropField";
import { CheckoutMethodSelector } from "@/components/admin/CheckoutMethodSelector";
import { parseCrop } from "@/lib/image-crop";
import type { CheckoutMethod } from "@/types/checkout";

export function SettingsManager({
  settings,
}: {
  settings: SiteSettingsRow | null;
}) {
  const [hours, setHours] = useState<OpeningHour[]>(
    (settings?.opening_hours as OpeningHour[]) ?? [
      { days: "Daily", time: "10:00 AM – 11:00 PM" },
    ]
  );
  const [checkoutMethod, setCheckoutMethod] = useState<CheckoutMethod>(
    settings?.checkout_method === "builtin" ? "builtin" : "whatsapp"
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    formData.set("opening_hours", JSON.stringify(hours));
    if (settings?.id) formData.set("id", settings.id);

    startTransition(async () => {
      const result = await updateSiteSettings(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess(true);
    });
  }

  return (
    <form
      action={handleSubmit}
      className="w-full max-w-3xl space-y-6 rounded-2xl border border-white/10 bg-surface-raised p-4 sm:space-y-8 sm:p-6"
    >
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-cream">Restaurant</h2>
        <Input
          name="restaurant_name"
          label="Restaurant name"
          defaultValue={settings?.restaurant_name ?? ""}
          required
        />
        <Input
          name="legal_name"
          label="Legal name"
          defaultValue={settings?.legal_name ?? ""}
        />
        <Input
          name="tagline"
          label="Tagline"
          defaultValue={settings?.tagline ?? ""}
        />
        <Textarea
          name="meta_description"
          label="Meta description (SEO)"
          defaultValue={settings?.meta_description ?? ""}
          rows={2}
        />
        <Input
          name="site_url"
          label="Website URL"
          defaultValue={settings?.site_url ?? ""}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-cream">Contact & WhatsApp</h2>
        <Input
          name="whatsapp_phone"
          label="WhatsApp number (digits only, e.g. 96170583901)"
          defaultValue={settings?.whatsapp_phone ?? ""}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="phone_primary"
            label="Primary phone"
            defaultValue={settings?.phone_primary ?? ""}
          />
          <Input
            name="phone_secondary"
            label="Secondary phone"
            defaultValue={settings?.phone_secondary ?? ""}
          />
        </div>
        <Input
          name="email"
          label="Email"
          type="email"
          defaultValue={settings?.email ?? ""}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-cream">Address</h2>
        <Input
          name="address_street"
          label="Street"
          defaultValue={settings?.address_street ?? ""}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="address_city"
            label="City"
            defaultValue={settings?.address_city ?? ""}
          />
          <Input
            name="address_state"
            label="State / Region"
            defaultValue={settings?.address_state ?? ""}
          />
        </div>
        <Input
          name="address_country"
          label="Country"
          defaultValue={settings?.address_country ?? "Lebanon"}
        />
        <Input
          name="google_maps_url"
          label="Google Maps link (optional)"
          placeholder="https://maps.google.com/..."
          defaultValue={settings?.google_maps_url ?? ""}
        />
        <p className="text-xs text-muted">
          Used by the mobile menu Location button. Leave empty to open a search
          from the address above.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-cream">Checkout Method</h2>
        <p className="text-sm text-muted">
          Choose how customers complete orders on your website. Only one method
          can be active at a time.
        </p>
        <CheckoutMethodSelector
          value={checkoutMethod}
          onChange={setCheckoutMethod}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="delivery_fee"
            label="Delivery fee (USD)"
            type="number"
            min={0}
            step={0.5}
            defaultValue={settings?.delivery_fee ?? 0}
          />
          <Input
            name="min_order"
            label="Minimum order (USD)"
            type="number"
            min={0}
            step={0.5}
            defaultValue={settings?.min_order ?? 0}
          />
        </div>
        <p className="text-xs text-muted">
          Delivery fee is shown at checkout and applied to built-in delivery
          orders. WhatsApp orders keep their existing message format.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-cream">Opening hours</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11 w-full sm:w-auto"
            onClick={() =>
              setHours((h) => [...h, { days: "", time: "" }])
            }
          >
            <Plus className="h-4 w-4" />
            Add slot
          </Button>
        </div>
        {hours.map((slot, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <Input
              label={i === 0 ? "Days" : undefined}
              value={slot.days}
              onChange={(e) => {
                const next = [...hours];
                next[i] = { ...next[i], days: e.target.value };
                setHours(next);
              }}
              placeholder="Mon–Fri"
              className="flex-1"
            />
            <Input
              label={i === 0 ? "Hours" : undefined}
              value={slot.time}
              onChange={(e) => {
                const next = [...hours];
                next[i] = { ...next[i], time: e.target.value };
                setHours(next);
              }}
              placeholder="10:00 AM – 11:00 PM"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => setHours((h) => h.filter((_, j) => j !== i))}
              className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-lg text-red-400 hover:bg-red-500/10 sm:mb-0"
              aria-label="Remove hours slot"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-cream">Social & branding</h2>
        <Input
          name="instagram_url"
          label="Instagram URL (optional)"
          placeholder="https://instagram.com/..."
          defaultValue={settings?.instagram_url ?? ""}
        />
        <Input
          name="facebook_url"
          label="Facebook URL (optional)"
          placeholder="https://facebook.com/..."
          defaultValue={settings?.facebook_url ?? ""}
        />
        <Input
          name="tiktok_url"
          label="TikTok URL (optional)"
          placeholder="https://tiktok.com/@..."
          defaultValue={settings?.tiktok_url ?? ""}
        />
        <p className="text-xs text-muted">
          Social links appear on the homepage. Empty fields hide the icon
          automatically.
        </p>
        <SettingsImageField
          name="logo_url"
          label="Logo image"
          defaultValue={settings?.logo_url ?? ""}
          previewAlt={settings?.restaurant_name ?? "Restaurant logo"}
        />
        <ImageCropField
          name="hero_image_url"
          cropName="hero_image_crop"
          label="Restaurant hero image"
          defaultUrl={settings?.hero_image_url ?? ""}
          defaultCrop={parseCrop(settings?.hero_image_crop)}
          previewRatio={16 / 9}
          helpText="Shown on the homepage at a 16:9 ratio. Upload, then adjust the framing."
        />
      </section>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {success ? (
        <p className="text-sm text-green-400">Settings saved successfully.</p>
      ) : null}

      <Button type="submit" isLoading={pending} className="min-h-11 w-full sm:w-auto">
        Save settings
      </Button>
    </form>
  );
}
