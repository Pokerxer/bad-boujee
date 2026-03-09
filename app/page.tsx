import { HeroSection, AboutTeaser, FeaturedProducts, EventTeaser, GalleryTeaser, NewsletterBanner } from "./components/home";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutTeaser />
      <FeaturedProducts />
      <EventTeaser />
      <GalleryTeaser />
      <NewsletterBanner />
    </main>
  );
}
