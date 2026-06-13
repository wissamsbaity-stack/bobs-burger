/**
 * Seed Supabase with menu data from menu-extracted.json
 *
 * Usage:
 *   node scripts/seed-menu.mjs
 *
 * Requires in .env.local (or environment):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnv() {
  try {
    const envPath = join(root, ".env.local");
    const raw = readFileSync(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local optional if vars are already set
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PLACEHOLDER =
  "https://s3.eu-central-1.amazonaws.com/act.omegapos.com/OmegaCloud/57069/omenu/2.jpg";

const categoryMeta = {
  "cat-sides": { name: "Sides", description: "Crispy fries, wings, tenders and golden sides" },
  "cat-baked-potato": { name: "Baked Potato", description: "Oven-baked loaded potatoes" },
  "cat-wraps-and-subs": { name: "Wraps & Subs", description: "Wraps and Lebanese-style subs" },
  "cat-beef-burger": { name: "Beef Burgers", description: "Char-grilled beef burgers" },
  "cat-angus-burgers": { name: "Angus Burgers", description: "Premium black Angus patties" },
  "cat-chicken-burger": { name: "Chicken Burgers", description: "Grilled and crispy chicken burgers" },
  "cat-upgrade": { name: "Upgrades", description: "Make it a combo meal" },
  "cat-soft-drink": { name: "Beverages", description: "Soft drinks and refreshments" },
  "cat-add-on-s": { name: "Add-Ons", description: "Sauces, dips and extras" },
  "cat-value-meals": { name: "Value Meals", description: "Special offers and promos" },
};

const extracted = JSON.parse(
  readFileSync(join(root, "src/data/menu-extracted.json"), "utf8")
);

const categories = extracted.categories.map((cat) => ({
  id: cat.id,
  name: categoryMeta[cat.id]?.name ?? cat.name,
  slug: cat.slug,
  description: categoryMeta[cat.id]?.description ?? cat.description ?? "",
  sort_order: cat.sortOrder,
}));

const menuItems = extracted.menuItems.map((item) => ({
  id: item.id,
  category_id: item.categoryId,
  name: item.name,
  slug: item.slug,
  description: item.description ?? "",
  price: item.price,
  image_url: item.imageUrl ?? PLACEHOLDER,
  is_featured: item.isFeatured ?? false,
  is_popular: item.isPopular ?? false,
  is_available: item.isAvailable ?? true,
  tags: item.tags ?? [],
}));

async function seed() {
  console.log("Clearing existing menu data...");
  await supabase.from("menu_items").delete().neq("id", "");
  await supabase.from("categories").delete().neq("id", "");

  console.log(`Inserting ${categories.length} categories...`);
  const { error: catError } = await supabase.from("categories").insert(categories);
  if (catError) throw catError;

  console.log(`Inserting ${menuItems.length} menu items...`);
  const batchSize = 50;
  for (let i = 0; i < menuItems.length; i += batchSize) {
    const batch = menuItems.slice(i, i + batchSize);
    const { error } = await supabase.from("menu_items").insert(batch);
    if (error) throw error;
    console.log(`  ${Math.min(i + batchSize, menuItems.length)} / ${menuItems.length}`);
  }

  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
