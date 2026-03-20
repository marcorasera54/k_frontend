import LandingHeader from "@/components/pages/landing/LandingHeader";
import HeroSection from "@/components/pages/landing/Hero";
import HowItWorksSection from "@/components/pages/landing/HowItWorks";
import FeaturesSection from "@/components/pages/landing/Features";
import SportsSection from "@/components/pages/landing/Sports";
import ForManagersSection from "@/components/pages/landing/ForManagers";
import TestimonialsSection from "@/components/pages/landing/Testimonials";
import CtaSection from "@/components/pages/landing/Cta";
import LandingFooter from "@/components/pages/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <section id="come-funziona">
          <HowItWorksSection />
        </section>
        <FeaturesSection />
        <section id="sport">
          <SportsSection />
        </section>
        <ForManagersSection />
        <section id="recensioni">
          <TestimonialsSection />
        </section>
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
