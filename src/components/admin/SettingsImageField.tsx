"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { uploadMenuImageClient } from "@/lib/admin/client-menu-image-upload";

interface SettingsImageFieldProps {
  name: string;
  label: string;
  defaultValue?: string;
  previewAlt: string;
}

export function SettingsImageField({
  name,
  label,
  defaultValue = "",
  previewAlt,
}: SettingsImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const result = await uploadMenuImageClient(file);
    setUploading(false);
    e.target.value = "";

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setUrl(result.url);
  }

  return (
    <div className="space-y-3">
      <Input
        name={name}
        label={label}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {url ? (
          <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-white/10 bg-ink">
            <Image
              src={url}
              alt={previewAlt}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        ) : null}
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : "Upload image"}
          </Button>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
