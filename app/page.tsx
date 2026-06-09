import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { Services } from "@/components/Services";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { buildAgentJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd data={buildAgentJsonLd()} />
      <Header />
      <main>
        <Hero />
        <FeaturedCarousel />
        <Services />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
