"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ADMIN_PASSWORD, BRAND } from "@/lib/brand";
import { CATEGORIES, DEPARTMENTS, MAX_FEATURED } from "@/lib/constants";
import type { Property } from "@/lib/types";
import { ImageUploader } from "./ImageUploader";

type Tab = "list" | "create" | "edit";

type FormData = {
  title: string;
  price: string;
  category: string;
  status: string;
  department: string;
  municipio: string;
  images: string[];
  details: string;
  amenities: string;
  whatsappText: string;
};

const emptyForm: FormData = {
  title: "",
  price: "",
  category: "",
  status: "",
  department: "",
  municipio: "",
  images: [],
  details: "",
  amenities: "",
  whatsappText: "",
};

function PropertyForm({
  form,
  setForm,
  token,
  onSubmit,
  submitLabel,
  successMsg,
}: {
  form: FormData;
  setForm: (f: FormData) => void;
  token: string;
  onSubmit: () => Promise<void>;
  submitLabel: string;
  successMsg: string;
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    await onSubmit();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-gold-400">Título *</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
            placeholder="Ej: Ciudad Maya"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gold-400">Precio *</label>
          <input
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
            placeholder="Ej: $565,000.00"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-gold-400">Categoría *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
          >
            <option value="">Selecciona categoría</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-gold-400">Estado *</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
          >
            <option value="">Selecciona tipo</option>
            <option value="venta">Venta</option>
            <option value="renta">Renta</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-gold-400">Departamento *</label>
          <select
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
          >
            <option value="">Selecciona departamento</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-gold-400">Municipio *</label>
          <input
            value={form.municipio}
            onChange={(e) => setForm({ ...form, municipio: e.target.value })}
            className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
            placeholder="Ej: San Pedro Sula"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-gold-400">Imágenes *</label>
        <ImageUploader
          token={token}
          images={form.images}
          onChange={(images) => setForm({ ...form, images })}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gold-400">Detalles (uno por línea)</label>
        <textarea
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
          rows={3}
          className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
          placeholder="4 Habitaciones&#10;4.5 Baños"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gold-400">Amenidades (separadas por coma)</label>
        <input
          value={form.amenities}
          onChange={(e) => setForm({ ...form, amenities: e.target.value })}
          className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
          placeholder="Sala, Terraza, Garaje"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gold-400">Texto WhatsApp (opcional)</label>
        <input
          value={form.whatsappText}
          onChange={(e) => setForm({ ...form, whatsappText: e.target.value })}
          className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={saving}
        className="w-full rounded-full bg-gold-gradient py-3.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
      >
        {saving ? "Guardando..." : submitLabel}
      </button>

      <AnimatePresence>
        {saved && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-gold-400"
          >
            {successMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AdminPanel() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [tab, setTab] = useState<Tab>("list");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [createForm, setCreateForm] = useState<FormData>(emptyForm);
  const [editForm, setEditForm] = useState<FormData>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("adminToken");
    if (stored === ADMIN_PASSWORD) setToken(stored);
  }, []);

  const loadList = useCallback(async (opts?: { silent?: boolean }) => {
    if (!token) return;
    if (!opts?.silent) setLoading(true);
    const res = await fetch(`/api/properties?all=1&refresh=1&t=${Date.now()}`, {
      cache: "no-store",
      headers: { "x-admin-token": token },
    });
    const data = await res.json();
    setProperties(Array.isArray(data) ? data : []);
    if (!opts?.silent) setLoading(false);
  }, [token]);

  const removePropertyLocal = useCallback((id: string) => {
    setProperties((prev) => prev.filter((p) => String(p.id) !== String(id)));
  }, []);

  const syncProperty = useCallback(async (id: string, patch: Partial<Property>) => {
    let snapshot: Property[] = [];
    setProperties((prev) => {
      snapshot = prev;
      return prev.map((p) => (String(p.id) === String(id) ? { ...p, ...patch } : p));
    });

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id, ...patch }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Error desconocido" }));
        setProperties(snapshot);
        alert(err.error || "No se pudo guardar el cambio");
        return false;
      }

      const updated = (await res.json()) as Property;
      setProperties((prev) =>
        prev.map((p) => (String(p.id) === String(id) ? updated : p))
      );
      return true;
    } catch {
      setProperties(snapshot);
      alert("Error de conexión");
      return false;
    }
  }, [token]);

  useEffect(() => {
    if (token) loadList();
  }, [token, loadList]);

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminToken", password);
      setToken(password);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const featuredCount = properties.filter((p) => p.featured && !p.hidden).length;

  const buildPayload = (form: FormData, id?: string) => ({
    ...(id ? { id } : {}),
    title: form.title.trim(),
    price: form.price.trim(),
    category: form.category,
    status: form.status.toLowerCase(),
    department: form.department,
    municipio: form.municipio.trim(),
    image: form.images[0],
    images: form.images,
    details: form.details.split("\n").map((s) => s.trim()).filter(Boolean),
    amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
    whatsappText: form.whatsappText.trim(),
  });

  const validateForm = (form: FormData) => {
    if (!form.title || !form.price || !form.category || !form.status || !form.department || !form.municipio || !form.images.length) {
      alert("Completa todos los campos requeridos e incluye al menos una imagen.");
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm(createForm)) return;
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify(buildPayload(createForm)),
    });
    if (res.ok) {
      const created = (await res.json()) as Property;
      setCreateForm(emptyForm);
      setProperties((prev) => [...prev, created]);
      setTab("list");
    } else {
      alert("Error al guardar: " + (await res.text()));
    }
  };

  const handleUpdate = async () => {
    if (!editId || !validateForm(editForm)) return;
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify(buildPayload(editForm, editId)),
    });
    if (res.ok) {
      const updated = (await res.json()) as Property;
      setProperties((prev) =>
        prev.map((p) => (String(p.id) === String(editId) ? updated : p))
      );
      setEditId(null);
      setTab("list");
    } else {
      alert("Error al actualizar: " + (await res.text()));
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    if (featured && featuredCount >= MAX_FEATURED) {
      alert(`Ya hay ${MAX_FEATURED} inmuebles destacados. Quita uno antes de destacar otro.`);
      return;
    }
    await syncProperty(id, { featured });
  };

  const toggleHidden = async (id: string, hidden: boolean) => {
    if (hidden && !confirm("¿Ocultar este inmueble del sitio?")) return;
    await syncProperty(id, { hidden });
  };

  const deleteProperty = async (id: string) => {
    if (!confirm("¿Borrar este inmueble permanentemente?")) return;

    const snapshot = properties;
    removePropertyLocal(id);

    try {
      const res = await fetch(`/api/properties?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
      });
      if (!res.ok) {
        setProperties(snapshot);
        alert("No se pudo borrar el inmueble");
      }
    } catch {
      setProperties(snapshot);
      alert("Error de conexión");
    }
  };

  const startEdit = (p: Property) => {
    setEditId(p.id);
    setEditForm({
      title: p.title,
      price: p.price,
      category: p.category,
      status: p.status,
      department: p.department,
      municipio: p.municipio,
      images: p.images?.length ? p.images : [p.image],
      details: (p.details || []).join("\n"),
      amenities: (p.amenities || []).join(", "),
      whatsappText: p.whatsappText || "",
    });
    setTab("edit");
  };

  if (!token) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-gold-400/20 bg-surface-card p-8">
        <h2 className="text-center font-display text-2xl font-semibold text-gold-400">
          Panel de Administración
        </h2>
        <p className="mt-1 text-center text-sm text-white/50">{BRAND.name}</p>
        <div className="mt-6">
          <label className="mb-1 block text-sm text-white/70">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
            placeholder="Ingresa la contraseña"
          />
        </div>
        <button
          type="button"
          onClick={login}
          className="mt-4 w-full rounded-full bg-gold-gradient py-3 text-sm font-semibold text-black"
        >
          Ingresar
        </button>
        {loginError && (
          <p className="mt-3 text-center text-sm text-red-400">Contraseña incorrecta</p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-semibold text-gold-400">Panel de Administración</h1>
        <p className="mt-1 text-sm text-white/50">{BRAND.name}</p>
        <p className="mt-2 text-xs text-white/40">
          Destacados: {featuredCount}/{MAX_FEATURED}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-3">
        {(["list", "create", "edit"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t);
              if (t === "edit" && !editId) setEditId(null);
            }}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
              tab === t
                ? "bg-gold-gradient text-black"
                : "border border-gold-400/30 text-gold-400 hover:bg-gold-400/10"
            }`}
          >
            {t === "list" ? "Inmuebles" : t === "create" ? "+ Crear" : "Editar"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gold-400/20 bg-surface-card p-6 sm:p-8">
        {tab === "create" && (
          <PropertyForm
            form={createForm}
            setForm={setCreateForm}
            token={token}
            onSubmit={handleCreate}
            submitLabel="Guardar inmueble"
            successMsg="Inmueble guardado exitosamente"
          />
        )}

        {tab === "edit" && !editId && (
          <div>
            <p className="mb-4 text-center text-white/60">Selecciona un inmueble para editar:</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => startEdit(p)}
                  className="flex items-center gap-3 rounded-xl border border-gold-400/20 bg-surface-elevated p-4 text-left transition hover:border-gold-400/50"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image src={p.image} alt="" fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{p.title}</p>
                    <p className="text-xs text-white/50">
                      {p.status} · {p.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "edit" && editId && (
          <div>
            <button
              type="button"
              onClick={() => setEditId(null)}
              className="mb-4 text-sm text-gold-400 hover:underline"
            >
              ← Volver a la lista
            </button>
            <PropertyForm
              form={editForm}
              setForm={setEditForm}
              token={token}
              onSubmit={handleUpdate}
              submitLabel="Actualizar inmueble"
              successMsg="Inmueble actualizado exitosamente"
            />
          </div>
        )}

        {tab === "list" && (
          <div>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
              </div>
            ) : properties.length === 0 ? (
              <p className="py-12 text-center text-white/50">Sin inmuebles</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {properties.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-gold-400/15 bg-surface-elevated p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                        <Image src={p.image} alt="" fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">
                          {p.title}
                          {p.hidden && (
                            <span className="ml-2 text-xs text-amber-400">(Oculto)</span>
                          )}
                          {p.featured && (
                            <span className="ml-2 text-xs text-gold-400">★ Destacado</span>
                          )}
                        </p>
                        <p className="text-sm text-white/50">
                          {p.status} · {p.price}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.featured ? (
                        <button
                          type="button"
                          onClick={() => toggleFeatured(p.id, false)}
                          className="rounded-lg bg-amber-600/80 px-3 py-1.5 text-xs font-medium text-white"
                        >
                          Quitar destacado
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleFeatured(p.id, true)}
                          disabled={featuredCount >= MAX_FEATURED}
                          className="rounded-lg bg-gold-400/80 px-3 py-1.5 text-xs font-medium text-black disabled:opacity-40"
                        >
                          Destacar
                        </button>
                      )}
                      {p.hidden ? (
                        <button
                          type="button"
                          onClick={() => toggleHidden(p.id, false)}
                          className="rounded-lg bg-blue-600/80 px-3 py-1.5 text-xs font-medium text-white"
                        >
                          Mostrar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleHidden(p.id, true)}
                          className="rounded-lg bg-gray-600/80 px-3 py-1.5 text-xs font-medium text-white"
                        >
                          Ocultar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="rounded-lg border border-gold-400/30 px-3 py-1.5 text-xs font-medium text-gold-400"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProperty(p.id)}
                        className="rounded-lg bg-red-600/80 px-3 py-1.5 text-xs font-medium text-white"
                      >
                        Borrar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
