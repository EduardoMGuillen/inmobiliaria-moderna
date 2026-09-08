"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type UploadItem = {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  url?: string;
  progress: number;
};

type ImageUploaderProps = {
  token: string;
  images: string[];
  onChange: (images: string[]) => void;
  onBusyChange?: (busy: boolean) => void;
};

export function ImageUploader({ token, images, onChange, onBusyChange }: ImageUploaderProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [activeUploads, setActiveUploads] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onBusyChange?.(activeUploads > 0);
  }, [activeUploads, onBusyChange]);

  const uploadFile = useCallback(
    async (item: UploadItem) => {
      setActiveUploads((n) => n + 1);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "uploading", progress: 10 } : i))
      );

      const dataUrl = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsDataURL(item.file);
      });

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, progress: 50 } : i))
      );

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-token": token },
          body: JSON.stringify({ name: item.file.name, dataBase64: dataUrl }),
        });

        if (!res.ok) throw new Error("Upload failed");

        const { url } = await res.json();
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: "done", progress: 100, url } : i
          )
        );
        onChange([...images, url]);
      } catch {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "error", progress: 0 } : i))
        );
      } finally {
        setActiveUploads((n) => Math.max(0, n - 1));
      }
    },
    [token, images, onChange]
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const newItems: UploadItem[] = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .map((file) => ({
          id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
          file,
          preview: URL.createObjectURL(file),
          status: "pending" as const,
          progress: 0,
        }));

      setItems((prev) => [...prev, ...newItems]);
      newItems.forEach((item) => uploadFile(item));
    },
    [uploadFile]
  );

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragging
            ? "border-gold-400 bg-gold-400/10"
            : "border-gold-400/30 bg-surface-elevated hover:border-gold-400/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="text-4xl">📷</div>
        <p className="mt-2 text-sm font-medium text-white">
          Arrastra imágenes aquí o haz clic para seleccionar
        </p>
        <p className="mt-1 text-xs text-white/50">JPG, PNG, WEBP — múltiples archivos</p>
      </div>

      {/* Upload progress */}
      <AnimatePresence>
        {items.filter((i) => i.status === "uploading" || i.status === "pending").length > 0 && (
          <div className="space-y-2">
            {items
              .filter((i) => i.status !== "done")
              .map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 rounded-xl bg-surface-elevated p-3"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                    <Image src={item.preview} alt="" fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1">
                    <p className="truncate text-sm text-white">{item.file.name}</p>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.status === "error" ? "bg-red-500" : "bg-gold-400"
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-white/50">
                    {item.status === "error" ? "Error" : `${item.progress}%`}
                  </span>
                </motion.div>
              ))}
          </div>
        )}
      </AnimatePresence>

      {/* Image grid with reorder */}
      {images.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-white/50">
            {images.length} imagen(es) — la primera es la principal. Usa ← → para reordenar.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((url, i) => (
              <div
                key={`${url}-${i}`}
                className="group relative aspect-square overflow-hidden rounded-xl border border-gold-400/20"
              >
                <Image src={url} alt="" fill className="object-cover" unoptimized />
                {i === 0 && (
                  <span className="absolute left-2 top-2 rounded bg-gold-400 px-2 py-0.5 text-[10px] font-bold text-black">
                    PRINCIPAL
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/60 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => moveImage(i, i - 1)}
                    disabled={i === 0}
                    className="rounded bg-white/20 px-2 py-1 text-xs text-white disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="rounded bg-red-600/80 px-2 py-1 text-xs text-white"
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(i, i + 1)}
                    disabled={i === images.length - 1}
                    className="rounded bg-white/20 px-2 py-1 text-xs text-white disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
