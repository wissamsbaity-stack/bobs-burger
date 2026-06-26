import type { ImageCrop } from "@/lib/image-crop";

export interface MenuBanner {
  id: string;
  imageUrl: string;
  imageCrop: ImageCrop | null;
  title: string | null;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  sortOrder: number;
  isEnabled: boolean;
}
