"use server";

import { createServerClient } from "@/lib/supabase/server";
import { isValidLebanonPhone } from "@/lib/utils";
import type { OrderType } from "@/types/order";

export interface PlaceOrderItem {
  name: string;
  quantity: number;
  price: number;
  notes: string | null;
}

export interface PlaceOrderInput {
  orderType: OrderType;
  customerName: string;
  customerPhone: string;
  city: string | null;
  street: string | null;
  building: string | null;
  deliveryInstructions: string | null;
  items: PlaceOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export async function placeOrder(
  input: PlaceOrderInput
): Promise<{ success: boolean; orderNumber?: number; error?: string }> {
  const supabase = await createServerClient();
  if (!supabase) {
    return { success: false, error: "Ordering is temporarily unavailable." };
  }

  const name = input.customerName.trim();
  const phone = input.customerPhone.trim();

  if (!name) {
    return { success: false, error: "Name is required." };
  }

  if (!phone || !isValidLebanonPhone(phone)) {
    return {
      success: false,
      error: "Enter a valid Lebanon mobile number (e.g. 70123456).",
    };
  }

  if (!input.items.length) {
    return { success: false, error: "Your cart is empty." };
  }

  if (input.orderType === "delivery") {
    if (!input.city?.trim() || !input.street?.trim() || !input.building?.trim()) {
      return { success: false, error: "Delivery address is required." };
    }
  }

  const payload = {
    customer_name: name,
    customer_phone: phone,
    city: input.orderType === "delivery" ? input.city!.trim() : null,
    street: input.orderType === "delivery" ? input.street!.trim() : null,
    building: input.orderType === "delivery" ? input.building!.trim() : null,
    delivery_instructions: input.deliveryInstructions?.trim() || null,
    items: input.items,
    subtotal: input.subtotal,
    delivery_fee: input.deliveryFee,
    total: input.total,
    order_type: input.orderType,
    is_read: false,
    status: "pending",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("orders")
    .insert(payload)
    .select("order_number")
    .single();

  if (error) {
    return { success: false, error: "Could not place your order. Please try again." };
  }

  return {
    success: true,
    orderNumber: data?.order_number ?? undefined,
  };
}
