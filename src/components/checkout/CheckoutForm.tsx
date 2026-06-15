"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { MessageCircle, Truck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import {
  buildWhatsAppOrderUrl,
} from "@/lib/whatsapp";
import { isValidLebanonPhone } from "@/lib/utils";
import type { DeliveryDetails } from "@/types/order";

interface FormErrors {
  name?: string;
  phone?: string;
  city?: string;
  street?: string;
  building?: string;
}

const initialForm: DeliveryDetails = {
  name: "",
  phone: "",
  city: "",
  street: "",
  building: "",
  deliveryInstructions: "",
};

export function CheckoutForm() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const settings = useSettings();
  const [form, setForm] = useState<DeliveryDetails>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (field: keyof DeliveryDetails, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!isValidLebanonPhone(form.phone))
      newErrors.phone = "Enter a valid Lebanon number (e.g. 70123456)";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.street.trim()) newErrors.street = "Street is required";
    if (!form.building.trim()) newErrors.building = "Building is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || items.length === 0) return;

    const url = buildWhatsAppOrderUrl({
      phone: settings.whatsapp,
      customer: form,
      items,
      subtotal,
      deliveryFee,
      total,
    });

    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
    setForm(initialForm);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-surface-raised p-8 text-center">
        <p className="mb-4 text-muted">Your cart is empty</p>
        <Link href="/menu">
          <Button variant="primary">Browse Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Full Name"
        placeholder="Your name"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        error={errors.name}
        required
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="70123456"
        value={form.phone}
        onChange={(e) => updateField("phone", e.target.value)}
        error={errors.phone}
        required
      />
      <p className="-mt-3 text-xs text-muted">
        Lebanon mobile only — no country code (e.g. 70, 71, 03, 76, 78, 79, 81)
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="City"
          placeholder="Aramoun"
          value={form.city}
          onChange={(e) => updateField("city", e.target.value)}
          error={errors.city}
          required
        />
        <Input
          label="Street"
          placeholder="Near Zarifa Cafe"
          value={form.street}
          onChange={(e) => updateField("street", e.target.value)}
          error={errors.street}
          required
        />
      </div>

      <Input
        label="Building"
        placeholder="Apt 4B, Floor 2, Villa 12..."
        value={form.building}
        onChange={(e) => updateField("building", e.target.value)}
        error={errors.building}
        required
      />

      <Textarea
        label="Delivery Instructions"
        placeholder="Ring the doorbell, gate code, landmarks..."
        value={form.deliveryInstructions}
        onChange={(e) => updateField("deliveryInstructions", e.target.value)}
        rows={3}
      />

      <div className="rounded-xl border border-white/10 bg-accent/5 p-4 sm:p-5">
        <div className="flex gap-3 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
            <Truck className="h-5 w-5 text-accent" aria-hidden />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium text-cream">
              Delivery fee
            </p>
            <p className="text-sm leading-relaxed text-cream/75">
              Delivery fees are calculated by the restaurant based on your
              location and will be confirmed after your order is received via
              WhatsApp.
            </p>
          </div>
        </div>
      </div>

      <Button type="submit" variant="whatsapp" size="lg" className="w-full">
        <MessageCircle className="h-5 w-5" />
        Send Order via WhatsApp
      </Button>

      <p className="text-center text-xs text-muted">
        Your order opens in WhatsApp with all details pre-filled
      </p>
    </form>
  );
}
