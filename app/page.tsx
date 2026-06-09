import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { Services } from "@/components/Services";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
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
