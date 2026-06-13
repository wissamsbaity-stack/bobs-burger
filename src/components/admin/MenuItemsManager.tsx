"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadMenuImage,
} from "@/app/admin/(dashboard)/actions";
import type { CategoryRow, MenuItemRow } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/utils";
import { Pencil, Trash2, Upload } from "lucide-react";

export function MenuItemsManager({
  items,
  categories,
}: {
  items: MenuItemRow[];
  categories: CategoryRow[];
}) {
  const [editing, setEditing] = useState<MenuItemRow | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setEditing(null);
    setImageUrl("");
    setError(null);
  }

  function startEdit(item: MenuItemRow) {
    setEditing(item);
    setImageUrl(item.image_url ?? "");
    setError(null);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    if (imageUrl) formData.set("image_url", imageUrl);
    startTransition(async () => {
      const action = editing ? updateMenuItem : createMenuItem;
      if (editing) formData.set("id", editing.id);
      const result = await action(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      resetForm();
    });
  }

  function handleUpload(file: File) {
    const fd = new FormData();
    fd.set("file", file);
    startTransition(async () => {
      const result = await uploadMenuImage(fd);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (result.url) setImageUrl(result.url);
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    startTransition(async () => {
      const result = await deleteMenuItem(id);
      if (!result.ok) setError(result.error);
    });
  }

  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.id, c.name])
  );

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-surface-raised p-6">
        <h2 className="mb-4 text-lg font-semibold text-cream">
          {editing ? "Edit menu item" : "Add menu item"}
        </h2>
        <form action={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Input
            name="name"
            label="Name"
            defaultValue={editing?.name ?? ""}
            required
            className="sm:col-span-2"
          />
          <div className="space-y-2 sm:col-span-2">
            <label className="block text-sm font-medium text-cream/80">
              Category
            </label>
            <select
              name="category_id"
              defaultValue={editing?.category_id ?? categories[0]?.id}
              required
              className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-cream focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <Textarea
            name="description"
            label="Description"
            defaultValue={editing?.description ?? ""}
            rows={3}
            className="sm:col-span-2"
          />
          <Input
            name="price"
            label="Price (LBP)"
            type="number"
            min={0}
            step={1000}
            defaultValue={editing?.price ?? ""}
            required
          />
          <Input
            name="tags"
            label="Tags (comma-separated)"
            defaultValue={editing?.tags?.join(", ") ?? ""}
          />

          <div className="space-y-2 sm:col-span-2">
            <label className="block text-sm font-medium text-cream/80">
              Image
            </label>
            <div className="flex flex-wrap items-center gap-4">
              {imageUrl ? (
                <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ) : null}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
                isLoading={pending}
              >
                <Upload className="h-4 w-4" />
                Upload image
              </Button>
              <Input
                name="image_url"
                placeholder="Or paste image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="max-w-md flex-1"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-cream/80">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={editing?.is_featured ?? false}
              className="rounded border-white/20"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-cream/80">
            <input
              type="checkbox"
              name="is_popular"
              defaultChecked={editing?.is_popular ?? false}
              className="rounded border-white/20"
            />
            Popular
          </label>
          <label className="flex items-center gap-2 text-sm text-cream/80 sm:col-span-2">
            <input
              type="checkbox"
              name="is_available"
              defaultChecked={editing?.is_available ?? true}
              className="rounded border-white/20"
            />
            Available on menu
          </label>

          {error ? (
            <p className="text-sm text-red-400 sm:col-span-2">{error}</p>
          ) : null}
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" isLoading={pending}>
              {editing ? "Save changes" : "Add item"}
            </Button>
            {editing ? (
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface-raised p-6">
        <h2 className="mb-4 text-lg font-semibold text-cream">
          All items ({items.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-muted">
                <th className="pb-3 pr-4 font-medium">Item</th>
                <th className="pb-3 pr-4 font-medium">Category</th>
                <th className="pb-3 pr-4 font-medium">Price</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-cream">{item.name}</p>
                  </td>
                  <td className="py-3 pr-4 text-muted">
                    {categoryMap[item.category_id] ?? item.category_id}
                  </td>
                  <td className="py-3 pr-4 text-cream">
                    {formatPrice(Number(item.price))}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        item.is_available
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {item.is_available ? "Available" : "Hidden"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="rounded-lg p-2 text-cream/60 hover:bg-white/5"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.name)}
                        className="rounded-lg p-2 text-red-400/70 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
