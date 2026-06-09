import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { PropertyDetail } from "@/components/PropertyDetail";
import { getPublicPropertyById } from "@/lib/properties-server";
import { buildPropertyJsonLd, buildPropertyMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPublicPropertyById(id);
  if (!property) {
    return { title: "Inmueble no encontrado" };
  }
  return buildPropertyMetadata(property);
}

export default async function InmueblePage({ params }: PageProps) {
  const { id } = await params;
  const property = await getPublicPropertyById(id);
  if (!property) notFound();

  return (
    <>
      <JsonLd data={buildPropertyJsonLd(property)} />
      <Header />
      <main className="min-h-screen">
        <PropertyDetail property={property} />
      </main>
      <Footer />
    </>
  );
}
