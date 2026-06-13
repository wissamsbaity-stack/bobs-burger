"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/admin/(dashboard)/actions";
import type { CategoryRow } from "@/lib/supabase/types";
import { Pencil, Trash2 } from "lucide-react";

export function CategoriesManager({
  categories,
}: {
  categories: CategoryRow[];
}) {
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const action = editing ? updateCategory : createCategory;
      if (editing) formData.set("id", editing.id);
      const result = await action(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setEditing(null);
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete category "${name}"? Menu items in this category may be affected.`)) {
      return;
    }
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-surface-raised p-6">
        <h2 className="mb-4 text-lg font-semibold text-cream">
          {editing ? "Edit category" : "Add category"}
        </h2>
        <form action={handleSubmit} className="space-y-4">
          <Input
            name="name"
            label="Name"
            defaultValue={editing?.name ?? ""}
            required
          />
          <Textarea
            name="description"
            label="Description"
            defaultValue={editing?.description ?? ""}
            rows={3}
          />
          <Input
            name="sort_order"
            label="Sort order"
            type="number"
            defaultValue={editing?.sort_order ?? categories.length}
          />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <div className="flex gap-3">
            <Button type="submit" isLoading={pending}>
              {editing ? "Save changes" : "Add category"}
            </Button>
            {editing ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditing(null);
                  setError(null);
                }}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface-raised p-6">
        <h2 className="mb-4 text-lg font-semibold text-cream">
          Categories ({categories.length})
        </h2>
        <ul className="divide-y divide-white/5">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-medium text-cream">{cat.name}</p>
                <p className="text-xs text-muted">
                  {cat.slug} · order {cat.sort_order}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(cat);
                    setError(null);
                  }}
                  className="rounded-lg p-2 text-cream/60 hover:bg-white/5 hover:text-cream"
                  aria-label={`Edit ${cat.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="rounded-lg p-2 text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
                  aria-label={`Delete ${cat.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
