"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { createServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/supabase/mappers";
import type { Database, OpeningHour } from "@/lib/supabase/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

type Tables = Database["public"]["Tables"];
type SupabaseFrom = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

function insertRow<T extends keyof Tables>(
  supabase: SupabaseFrom,
  table: T,
  row: Tables[T]["Insert"]
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from(table).insert(row);
}

function updateRow<T extends keyof Tables>(
  supabase: SupabaseFrom,
  table: T,
  row: Tables[T]["Update"],
  column: string,
  value: string
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from(table).update(row).eq(column, value);
}

function fail(message: string): ActionResult {
  return { ok: false, error: message };
}

export async function signOut(): Promise<void> {
  const supabase = await createServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createCategory(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  if (!name) return fail("Category name is required");

  const slug = slugify(name);
  const id = `cat-${slug}`;
  const { error } = await insertRow(supabase, "categories", {
    id,
    name,
    slug,
    description: description || null,
    sort_order: sortOrder,
  });

  if (error) return fail(error.message);
  revalidatePath("/admin/categories");
  revalidatePath("/menu");
  revalidatePath("/");
  return { ok: true };
}

export async function updateCategory(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  if (!id || !name) return fail("Category id and name are required");

  const { error } = await updateRow(
    supabase,
    "categories",
    {
      name,
      slug: slugify(name),
      description: description || null,
      sort_order: sortOrder,
    },
    "id",
    id
  );

  if (error) return fail(error.message);
  revalidatePath("/admin/categories");
  revalidatePath("/menu");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return fail(error.message);
  revalidatePath("/admin/categories");
  revalidatePath("/menu");
  revalidatePath("/");
  return { ok: true };
}

export async function createMenuItem(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const imageUrl = String(formData.get("image_url") ?? "").trim() || null;
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!name || !categoryId) return fail("Name and category are required");
  if (!price || price < 0) return fail("Valid price is required");

  const slug = `${slugify(name)}-${Date.now()}`;
  const id = `item-${Date.now()}`;
  const { error } = await insertRow(supabase, "menu_items", {
    id,
    name,
    slug,
    category_id: categoryId,
    description: description || null,
    price,
    image_url: imageUrl,
    is_popular: formData.get("is_popular") === "on",
    is_best_seller: formData.get("is_best_seller") === "on",
    is_available: formData.get("is_available") !== "off",
    tags,
  });

  if (error) return fail(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/");
  return { ok: true };
}

export async function updateMenuItem(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const imageUrl = String(formData.get("image_url") ?? "").trim() || null;
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!id || !name || !categoryId) return fail("Missing required fields");

  const { error } = await updateRow(
    supabase,
    "menu_items",
    {
      name,
      category_id: categoryId,
      description: description || null,
      price,
      image_url: imageUrl,
      is_popular: formData.get("is_popular") === "on",
      is_best_seller: formData.get("is_best_seller") === "on",
      is_available: formData.get("is_available") === "on",
      tags,
    },
    "id",
    id
  );

  if (error) return fail(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteMenuItem(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) return fail(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/");
  return { ok: true };
}

export async function updateSiteSettings(
  formData: FormData
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const hoursRaw = String(formData.get("opening_hours") ?? "[]");
  let openingHours: OpeningHour[] = [];
  try {
    openingHours = JSON.parse(hoursRaw) as OpeningHour[];
  } catch {
    return fail("Invalid opening hours format");
  }

  const settingsId = String(formData.get("id") ?? "");
  const payload = {
    restaurant_name: String(formData.get("restaurant_name") ?? "").trim(),
    legal_name: String(formData.get("legal_name") ?? "").trim() || null,
    tagline: String(formData.get("tagline") ?? "").trim() || null,
    whatsapp_phone: String(formData.get("whatsapp_phone") ?? "")
      .replace(/\D/g, "")
      .trim(),
    phone_primary: String(formData.get("phone_primary") ?? "").trim() || null,
    phone_secondary:
      String(formData.get("phone_secondary") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    address_street:
      String(formData.get("address_street") ?? "").trim() || null,
    address_city: String(formData.get("address_city") ?? "").trim() || null,
    address_state:
      String(formData.get("address_state") ?? "").trim() || null,
    address_country:
      String(formData.get("address_country") ?? "").trim() || "Lebanon",
    opening_hours: openingHours,
    delivery_fee: Number(formData.get("delivery_fee") ?? 0),
    min_order: Number(formData.get("min_order") ?? 0),
    instagram_url:
      String(formData.get("instagram_url") ?? "").trim() || null,
    facebook_url: String(formData.get("facebook_url") ?? "").trim() || null,
    logo_url: String(formData.get("logo_url") ?? "").trim() || null,
    cover_url: String(formData.get("cover_url") ?? "").trim() || null,
    hero_image_url:
      String(formData.get("hero_image_url") ?? "").trim() || null,
    site_url: String(formData.get("site_url") ?? "").trim() || null,
    meta_description:
      String(formData.get("meta_description") ?? "").trim() || null,
  };

  if (!payload.restaurant_name || !payload.whatsapp_phone) {
    return fail("Restaurant name and WhatsApp number are required");
  }

  const { error } = settingsId
    ? await updateRow(supabase, "site_settings", payload, "id", settingsId)
    : await insertRow(supabase, "site_settings", payload);
  if (error) return fail(error.message);

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/menu");
  revalidatePath("/contact");
  revalidatePath("/checkout");
  return { ok: true };
}
