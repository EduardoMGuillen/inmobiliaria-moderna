"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";
import { MotionSection } from "./MotionSection";

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          date: data.get("date"),
          time: data.get("time"),
          property: data.get("property") || "",
          message: data.get("message") || "",
        }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("¡Cita solicitada! Nos pondremos en contacto pronto.");
        form.reset();
      } else {
        setStatus("error");
        setMessage("Error al enviar. Intenta de nuevo o contáctanos por WhatsApp.");
      }
    } catch {
      setStatus("error");
      setMessage("Error de conexión. Intenta de nuevo.");
    }
  }

  return (
    <section id="contacto" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionSection>
          <div className="overflow-hidden rounded-[2rem] border border-gold-400/20 bg-surface-card">
            <div className="grid lg:grid-cols-2">
              <div className="relative bg-gold-gradient p-8 sm:p-12 lg:p-14">
                <div className="relative">
                  <h2 className="font-display text-3xl font-semibold text-black sm:text-4xl">
                    ¿Listo para el siguiente paso?
                  </h2>
                  <p className="mt-4 text-black/80">
                    Contáctanos para agendar una visita o recibir asesoría personalizada sobre tu inmueble.
                  </p>
                  <div className="mt-8 space-y-4 text-black/90">
                    <p className="flex items-center gap-3">
                      <span className="text-xl">📍</span> {BRAND.address}
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-xl">📞</span>
                      <a href={`tel:${BRAND.phoneRaw}`} className="hover:underline">
                        {BRAND.phone}
                      </a>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-xl">✉️</span>
                      <a href={`mailto:${BRAND.email}`} className="hover:underline">
                        {BRAND.email}
                      </a>
                    </p>
                  </div>
                  {(BRAND.whatsapp || BRAND.phone) && (
                  <div className="mt-8 flex gap-3">
                    <a
                      href={BRAND.whatsapp || `tel:${BRAND.phoneRaw}`}
                      target={BRAND.whatsapp ? "_blank" : undefined}
                      rel={BRAND.whatsapp ? "noopener noreferrer" : undefined}
                      className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/80"
                    >
                      {BRAND.whatsapp ? "WhatsApp" : "Llamar"}
                    </a>
                  </div>
                  )}
                </div>
              </div>

              <div className="p-8 sm:p-12 lg:p-14">
                <h3 className="font-display text-xl font-semibold text-white">Agendar una cita</h3>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm text-white/70">Nombre completo *</label>
                      <input
                        name="name"
                        required
                        className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-white/70">Email *</label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm text-white/70">Teléfono *</label>
                      <input
                        name="phone"
                        type="tel"
                        required
                        className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-white/70">Fecha *</label>
                      <input
                        name="date"
                        type="date"
                        required
                        className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm text-white/70">Hora *</label>
                      <input
                        name="time"
                        type="time"
                        required
                        className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-white/70">Inmueble de interés</label>
                      <input
                        name="property"
                        className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-white/70">Mensaje adicional</label>
                    <textarea
                      name="message"
                      rows={3}
                      className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-3 text-white outline-none focus:border-gold-400"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-full bg-gold-gradient py-3.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
                  >
                    {status === "loading" ? "Enviando..." : "Solicitar cita"}
                  </motion.button>
                  {message && (
                    <p
                      className={`text-center text-sm ${
                        status === "success" ? "text-gold-400" : "text-red-400"
                      }`}
                    >
                      {message}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </MotionSection>
      </div>
    </section>
  );
}
