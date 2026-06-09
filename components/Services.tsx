"use client";

import { MotionSection } from "./MotionSection";

const services = [
  {
    title: "Compra y venta",
    description: "Asesoría integral para comprar o vender tu propiedad con las mejores condiciones del mercado.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "Renta de inmuebles",
    description: "Encuentra la propiedad ideal en renta o renta la tuya con total respaldo legal y profesional.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  },
  {
    title: "Tasación profesional",
    description: "Valoración precisa de tu propiedad basada en el mercado hondureño actual.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Asesoría legal",
    description: "Acompañamiento en trámites legales, contratos y documentación de tu operación inmobiliaria.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
  {
    title: "Inversión inmobiliaria",
    description: "Oportunidades de inversión en bienes raíces residenciales y comerciales en Honduras.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: "Administración de propiedades",
    description: "Gestión completa de tu propiedad en renta: mantenimiento, cobros y atención a inquilinos.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

export function Services() {
  return (
    <section id="servicios" className="scroll-mt-28 border-t border-gold-400/10 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionSection>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">Servicios</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
              Soluciones <span className="text-gradient">integrales</span>
            </h2>
          </div>
        </MotionSection>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <MotionSection key={s.title} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-gold-400/15 bg-surface-card p-6 transition hover:border-gold-400/30 hover:shadow-glow">
                <div className="mb-4 inline-flex rounded-xl bg-gold-400/10 p-3 text-gold-400 transition group-hover:bg-gold-400/20">
                  {s.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.description}</p>
              </div>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}
