import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, ArrowRight, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Developed by Palawan Collective</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
              Connecting the Physical World to Useful Digital Action
            </h1>
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
              We believe physical spaces should communicate effortlessly without clumsy app downloads or generic templates.
            </p>
          </div>

          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <Image
              src="/images/merqato-hero-tap.jpg"
              alt="MerQato Palawan hardware on resort dining table"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 80vw"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm text-[var(--text-secondary)] leading-relaxed">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] font-serif-editorial">
                Born in Palawan, Built for Global Excellence
              </h2>
              <p>
                Palawan is celebrated globally for pristine natural biodiversity, world-class island hospitality, and conscious eco-tourism. Yet, operating here requires resilient technology: humidity, intense saltwater exposure, and seasonal tourist influxes challenge ordinary business tools.
              </p>
              <p>
                MerQato was engineered by Palawan Collective to bridge tactile industrial design with ultra-fast edge cloud infrastructure. We craft hardware from sustainable Philippine hardwoods, precision anodized aluminum, and weatherproof polymers that feel premium on luxury dining tables.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] font-serif-editorial">
                A Globally Competitive Philosophy
              </h2>
              <p>
                We do not view ourselves as an ordinary QR-code generator or a digital marketing agency. MerQato is a connected-business technology platform that turns everyday tables, doors, equipment, and products into direct conduits for human connection.
              </p>
              <p>
                Starting from boutique resorts and beachfront dining across Puerto Princesa, El Nido, Coron, and San Vicente, MerQato is architected to scale into marine operations, solar energy, equipment rentals, and manufacturing across the Philippines and international markets.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] font-serif-editorial">
                Meet the Palawan Team
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                We'd love to show you physical hardware samples and live guest portals in person.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold shadow-xs"
            >
              Contact Palawan Collective
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
