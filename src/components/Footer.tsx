import Link from "next/link";
import { ArrowUpRight, MapPin, Shield } from "lucide-react";

const footerGroups = [
  {
    title: "Platform",
    links: [
      { label: "Solutions", href: "/solutions" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Pilot program", href: "/pilot-program" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Hospitality",
    links: [
      { label: "Digital menus", href: "/use-cases/digital-menus-and-ordering" },
      { label: "Guest portals", href: "/use-cases/hotel-guest-portals" },
      { label: "Google reviews", href: "/use-cases/google-review-collection" },
      { label: "Customer loyalty", href: "/use-cases/customer-loyalty" },
    ],
  },
  {
    title: "Hardware",
    links: [
      { label: "All products", href: "/products" },
      { label: "NFC stickers", href: "/products/round-nfc-stickers" },
      { label: "Tabletop standups", href: "/products/tabletop-standups" },
      { label: "Asset labels", href: "/products/specialized-asset-labels" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Industries", href: "/#industries" },
      { label: "About NFC Palawan Island", href: "/about" },
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-9 py-10 sm:gap-10 sm:py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] lg:gap-12 lg:py-16">
          {/* Brand: one compact message instead of multiple stacked paragraphs. */}
          <div className="flex min-w-0 flex-col items-start lg:border-r lg:border-[var(--border-subtle)] lg:pr-10">
            <Link href="/" aria-label="NFC Palawan Island home" className="group inline-flex items-center gap-2.5">
              <img
                src="/brand/palawan-collective-logo-dark.png"
                alt=""
                aria-hidden="true"
                className="h-9 w-9 shrink-0 object-contain transition-transform duration-300 group-hover:rotate-[-8deg] dark:hidden"
              />
              <img
                src="/brand/palawan-collective-logo-light.png"
                alt=""
                aria-hidden="true"
                className="hidden h-9 w-9 shrink-0 object-contain transition-transform duration-300 group-hover:rotate-[-8deg] dark:block"
              />
              <span className="font-serif-editorial text-[25px] font-bold leading-none tracking-tight text-[var(--text-primary)]">
                NFC Palawan Island
              </span>
            </Link>

            <p className="mt-5 font-serif-editorial text-[19px] leading-[1.2] tracking-tight text-[var(--text-primary)] sm:text-[22px] lg:text-[24px]">
              Make Every Tap Count.
            </p>
            <p className="mt-2 max-w-[34ch] text-[13px] leading-[1.65] sm:text-[14px]">
              Turn places, products, and equipment into useful digital experiences. By Palawan Collective.
            </p>

            <p className="mt-4 inline-flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
              Palawan, Philippines
            </p>

            <Link
              href="/contact"
              className="group mt-6 inline-flex min-h-10 items-center justify-between gap-4 rounded-full border border-[var(--border-strong)] px-4 py-2 text-[12px] font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Request a demo
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-[var(--accent)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Two equal columns on phones; four even columns from tablet upwards. */}
          <nav
            aria-label="Footer navigation"
            className="grid min-w-0 grid-cols-2 gap-x-5 gap-y-8 border-t border-[var(--border-subtle)] pt-8 md:grid-cols-4 md:gap-x-6 md:gap-y-0 lg:border-t-0 lg:pt-1"
          >
            {footerGroups.map((group) => (
              <div key={group.title} className="min-w-0">
                <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--text-primary)]">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-1 sm:mt-5">
                  {group.links.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="inline-flex min-h-8 items-center text-[13px] leading-[1.35] transition-colors hover:text-[var(--accent)] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:text-[13px] lg:text-[14px]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Legal and ownership remain a short, aligned bottom bar at every size. */}
        <div className="flex flex-col gap-3 border-t border-[var(--border-subtle)] py-5 text-[11px] leading-relaxed text-[var(--text-muted)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:py-6">
          <p>© {new Date().getFullYear()} NFC Palawan Island · Palawan Collective</p>
          <nav aria-label="Legal and administration" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-[var(--text-primary)]">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[var(--text-primary)]">
              Terms
            </Link>
            <Link href="/admin" className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--text-primary)]">
              <Shield aria-hidden="true" className="h-3 w-3" />
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
