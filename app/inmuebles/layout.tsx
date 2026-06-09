import type { Metadata } from "next";
import { inmueblesMetadata } from "@/lib/seo";

export const metadata: Metadata = inmueblesMetadata;

export default function InmueblesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
