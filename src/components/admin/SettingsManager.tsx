"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { updateSiteSettings } from "@/app/admin/(dashboard)/actions";
import type { OpeningHour, SiteSettingsRow } from "@/lib/supabase/types";
import { Plus, Trash2 } from "lucide-react";

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
      className="max-w-3xl space-y-8 rounded-2xl border border-white/10 bg-surface-raised p-6"
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
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-cream">Opening hours</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setHours((h) => [...h, { days: "", time: "" }])
            }
          >
            <Plus className="h-4 w-4" />
            Add slot
          </Button>
        </div>
        {hours.map((slot, i) => (
          <div key={i} className="flex gap-3">
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
              className="mt-7 rounded-lg p-2 text-red-400 hover:bg-red-500/10"
              aria-label="Remove hours slot"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-cream">Ordering</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="delivery_fee"
            label="Delivery fee (LBP)"
            type="number"
            min={0}
            defaultValue={settings?.delivery_fee ?? 0}
          />
          <Input
            name="min_order"
            label="Minimum order (LBP)"
            type="number"
            min={0}
            defaultValue={settings?.min_order ?? 0}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-cream">Social & branding</h2>
        <Input
          name="instagram_url"
          label="Instagram URL"
          defaultValue={settings?.instagram_url ?? ""}
        />
        <Input
          name="facebook_url"
          label="Facebook URL"
          defaultValue={settings?.facebook_url ?? ""}
        />
        <Input
          name="logo_url"
          label="Logo image URL"
          defaultValue={settings?.logo_url ?? ""}
        />
        <Input
          name="cover_url"
          label="Cover image URL"
          defaultValue={settings?.cover_url ?? ""}
        />
        <Input
          name="hero_image_url"
          label="Hero burger image URL"
          defaultValue={settings?.hero_image_url ?? ""}
        />
      </section>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {success ? (
        <p className="text-sm text-green-400">Settings saved successfully.</p>
      ) : null}

      <Button type="submit" isLoading={pending}>
        Save settings
      </Button>
    </form>
  );
}
