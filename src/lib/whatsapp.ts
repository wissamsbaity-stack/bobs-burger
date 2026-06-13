import type { CartItem } from "@/types/cart";
import type { DeliveryDetails } from "@/types/order";
import { formatLebanonPhoneForWhatsApp, formatPrice } from "./utils";
import { siteConfig } from "@/config/site";

const RESTAURANT_NAME = "Bob's Burger";

interface WhatsAppOrderParams {
  phone: string;
  customer: DeliveryDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export function buildWhatsAppOrderMessage({
  customer,
  items,
  subtotal,
  deliveryFee,
  total,
}: Omit<WhatsAppOrderParams, "phone">): string {
  const customerPhone = formatLebanonPhoneForWhatsApp(customer.phone);

  const lines: string[] = [
    `🍔 *New Order — ${RESTAURANT_NAME}*`,
    "",
    "*Customer Details*",
    `Name: ${customer.name}`,
    `Phone: +${customerPhone}`,
    "",
    "*Delivery Address*",
    `City: ${customer.city}`,
    `Street: ${customer.street}`,
    `Building: ${customer.building}`,
  ];

  if (customer.deliveryInstructions.trim()) {
    lines.push(`Instructions: ${customer.deliveryInstructions}`);
  }

  lines.push("", "*Order Items*");

  items.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;
    lines.push(
      `${index + 1}. ${item.name} x${item.quantity} — ${formatPrice(lineTotal)}`
    );
    if (item.notes.trim()) {
      lines.push(`   Note: ${item.notes}`);
    }
  });

  lines.push("", `Subtotal: ${formatPrice(subtotal)}`);

  if (deliveryFee > 0) {
    lines.push(`Delivery: ${formatPrice(deliveryFee)}`);
  }

  lines.push(`*Total: ${formatPrice(total)}*`, "", "Sent via Bob's Burger");

  return lines.join("\n");
}

export function buildWhatsAppOrderUrl({
  phone,
  customer,
  items,
  subtotal,
  deliveryFee,
  total,
}: WhatsAppOrderParams): string {
  const sanitizedPhone = phone.replace(/\D/g, "");
  const message = buildWhatsAppOrderMessage({
    customer,
    items,
    subtotal,
    deliveryFee,
    total,
  });

  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`;
}

export function getRestaurantWhatsAppPhone(): string {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? siteConfig.whatsappPhone
  );
}

export function buildWhatsAppContactUrl(
  message?: string,
  phone?: string
): string {
  const resolvedPhone =
    phone ?? process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? siteConfig.whatsappPhone;
  const text = message ?? "Hi Bob's Burger! I'd like to place an order.";
  return `https://wa.me/${resolvedPhone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
