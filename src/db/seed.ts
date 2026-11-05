import { db } from "./index";
import {
  admins,
  siteSettings,
  industries,
  useCases,
  products,
  pages,
  insights,
  leads,
  auditLogs,
} from "./schema";
import { previewIndustryCopy } from "../lib/industry-copy";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  try {
    // Check if already seeded
    const existingAdmins = await db.select().from(admins).limit(1);
    if (existingAdmins.length > 0) {
      return;
    }

    console.log("Seeding NFC Palawan Island database...");

    const passwordHash = await bcrypt.hash("Merqato2026!Admin", 10);
    const editorHash = await bcrypt.hash("Merqato2026!Editor", 10);

    // 1. Admins
    await db.insert(admins).values([
      {
        email: "admin@merqato.digital",
        passwordHash,
        name: "Palawan Collective Admin",
        role: "owner",
        avatarUrl: "",
      },
      {
        email: "editor@merqato.digital",
        passwordHash: editorHash,
        name: "Editorial Manager",
        role: "editor",
        avatarUrl: "",
      },
    ]);

    // 2. Site Settings
    await db.insert(siteSettings).values([
      {
        key: "brand",
        value: {
          siteName: "NFC Palawan Island",
          domain: "merqato.digital",
          creator: "Palawan Collective",
          headline: "Make Every Tap Count.",
          subheadline: "Turn everyday objects into powerful business tools.",
          description:
            "NFC Palawan Island connects physical places, products, and equipment to useful digital experiences through QR codes, NFC technology, and connected business software.",
          contactEmail: "hello@merqato.digital",
          contactPhone: "+63 (048) 433-2890",
          address: "Palawan Collective Technology Hub, Rizal Avenue, Puerto Princesa, Palawan 5300, Philippines",
          socials: {
            linkedin: "https://linkedin.com/company/merqato",
            instagram: "https://instagram.com/merqato.digital",
            facebook: "https://facebook.com/merqato.digital",
          },
        },
        description: "Primary brand information and contact coordinates",
      },
      {
        key: "pilot_offer",
        value: {
          title: "Palawan Hospitality Connected Pilot",
          badge: "Limited to 20 Palawan Hospitality Venues",
          durationDays: 90,
          setupCommitmentPhp: 1000,
          regularValuePhp: 12500,
          inclusions: [
            "25 custom-designed physical NFC Palawan Island smart NFC & QR tabletop discs or standups",
            "Branded mobile guest portal: digital menu, instant concierge & guest requests",
            "1-Tap Google Review accelerator directly configured for your venue",
            "On-site deployment, staff training & setup in Puerto Princesa, El Nido, Coron, or San Vicente",
            "90 days of full digital experience hosting, zero monthly fees during pilot",
            "Hardware ownership: Keep all physical smart tags even after the 90-day trial",
            "Priority onboarding for future POS & PMS integrations",
          ],
          eligibility: "Open to licensed boutique resorts, eco-lodges, beachfront restaurants, cafes, and island tour operators operating in Palawan.",
          spotsRemaining: 7,
          maxSpots: 20,
          isActive: true,
          guaranteeText: "No recurring subscription commitments during the 90-day pilot. ₱1,000 setup commitment covers physical tag production.",
        },
        description: "Commercial pilot program configuration",
      },
      {
        key: "navigation",
        value: {
          links: [
            { label: "Solutions", href: "/solutions" },
            { label: "Industries", href: "/#industries" },
            { label: "Products", href: "/products" },
            { label: "How It Works", href: "/how-it-works" },
            { label: "Pilot Program", href: "/pilot-program" },
            { label: "About", href: "/about" },
          ],
          cta: { label: "Request a Demo", href: "/#contact" },
        },
        description: "Main header navigation items",
      },
      {
        key: "seo_defaults",
        value: {
          metaTitle: "NFC Palawan Island | Connected Business Experiences — NFC & QR Solutions",
          metaDescription:
            "Make Every Tap Count. NFC Palawan Island connects physical places, products, and equipment to useful digital experiences with smart NFC tags and connected hospitality software in Palawan, Philippines.",
          ogImage: "/images/merqato-hero-tap.jpg",
          canonicalBase: "https://merqato.digital",
          robotsIndexing: true,
        },
        description: "Global SEO and metadata defaults",
      },
    ]);

    // 3. Industries — illustrative, editable preview copy, not customer results
    const industryDefaults = [
      { slug: "hospitality", name: "Hospitality & Resorts", icon: "Hotel", imageUrl: "/images/merqato-hospitality-portal.jpg", isPrimary: true, sortOrder: 1 },
      { slug: "restaurants-and-cafes", name: "Restaurants and Cafés", icon: "Utensils", imageUrl: "/images/merqato-hero-tap.jpg", isPrimary: false, sortOrder: 2 },
      { slug: "tourism-and-marine", name: "Tourism and Marine", icon: "Ship", imageUrl: "/images/merqato-industrial-tag.jpg", isPrimary: false, sortOrder: 3 },
      { slug: "property-and-facilities", name: "Property and Facilities", icon: "Building2", imageUrl: "/images/merqato-product-tags.jpg", isPrimary: false, sortOrder: 4 },
      { slug: "solar-and-energy", name: "Solar and Energy", icon: "SunMedium", imageUrl: "/images/merqato-industrial-tag.jpg", isPrimary: false, sortOrder: 5 },
      { slug: "equipment-rentals", name: "Equipment Rentals", icon: "Wrench", imageUrl: "/images/merqato-product-tags.jpg", isPrimary: false, sortOrder: 6 },
      { slug: "manufacturing-and-product-identity", name: "Manufacturing & Product Identity", icon: "Sparkles", imageUrl: "/images/merqato-product-tags.jpg", isPrimary: false, sortOrder: 7 },
      { slug: "logistics-and-supply-chains", name: "Logistics and Supply Chains", icon: "Truck", imageUrl: "/images/merqato-industrial-tag.jpg", isPrimary: false, sortOrder: 8 },
      { slug: "events-and-experiences", name: "Events and Experiences", icon: "Ticket", imageUrl: "/images/merqato-product-tags.jpg", isPrimary: false, sortOrder: 9 },
    ];
    await db.insert(industries).values(
      industryDefaults.map((item) => ({
        ...item,
        ...previewIndustryCopy[item.slug],
        status: "published",
        exampleDeployments: [],
      })),
    );

    // 4. Hospitality Solutions & Use Cases
    await db.insert(useCases).values([
      {
        slug: "digital-menus-and-ordering",
        title: "Digital Menus and Ordering",
        subtitle: "Dynamic, fast, and multilingual food & beverage presentation",
        description:
          "Guests tap the table tag to immediately view high-resolution photography, dietary tags (vegan, gluten-free, halal), live currency conversions, and chef's daily catch specials. No outdated paper PDFs, no slow downloads.",
        icon: "Menu",
        imageUrl: "/images/merqato-hospitality-portal.jpg",
        industrySlugs: ["hospitality", "restaurants-and-cafes"],
        features: [
          "Instant load in under 600ms via high-performance edge hosting",
          "Instant updates from any device: mark items sold out in 3 clicks",
          "Automatic multilingual translation for international travelers",
          "Optional table-to-kitchen order dispatch or staff call button",
        ],
        benefits: [
          "Eliminate 100% of paper menu reprinting expenses",
          "Increase average ticket size by 14-22% through high-margin modifier recommendations",
          "Empower servers to focus on hospitality rather than manual order transcription",
        ],
        demoType: "menu",
        isHospitalityFeature: true,
        sortOrder: 1,
        status: "published",
      },
      {
        slug: "google-review-collection",
        title: "Google Review Collection",
        subtitle: "Capture positive feedback at the exact moment of guest satisfaction",
        description:
          "Tapping the NFC Palawan Island standup launches an optimized 1-tap review prompt directly into Google Maps on the guest's phone, bypassing confusing searches and login barriers.",
        icon: "Star",
        imageUrl: "/images/merqato-hero-tap.jpg",
        industrySlugs: ["hospitality", "restaurants-and-cafes", "tourism-and-marine"],
        features: [
          "Deep-linked Google Maps profile opener tailored for iOS and Android",
          "Smart sentiment pre-filter: routes delighted guests to public reviews and handles feedback privately",
          "Customizable placement on bill presenters, checkout stands, and room key cards",
          "Analytics on review tap volume by specific table or server shift",
        ],
        benefits: [
          "3x to 5x higher review velocity compared to email follow-up requests",
          "Elevate your TripAdvisor and Google Maps local search ranking in Palawan",
          "Capture constructive feedback before guests publish negative public ratings",
        ],
        demoType: "review",
        isHospitalityFeature: true,
        sortOrder: 2,
        status: "published",
      },
      {
        slug: "hotel-guest-portals",
        title: "Hotel Guest Portals",
        subtitle: "A comprehensive digital concierge for in-room and poolside delight",
        description:
          "Replace clumsy hotel binders with an elegant, branded mobile portal. Guests tap bedside discs for Wi-Fi auto-connect, spa bookings, resort hours, breakfast schedules, and island excursion details.",
        icon: "Smartphone",
        imageUrl: "/images/merqato-hospitality-portal.jpg",
        industrySlugs: ["hospitality", "property-and-facilities"],
        features: [
          "1-Tap Wi-Fi network joining without manual password typing",
          "Interactive resort map with navigation and facility timings",
          "Direct emergency contact and front desk WhatsApp integration",
          "Zero app installation required — lives entirely on secure mobile web",
        ],
        benefits: [
          "Reduce front-desk repetitive phone inquiries by up to 75%",
          "Keep guests informed about weather updates, high tides, and sunset happy hours",
          "Seamless extension to sun loungers, cabanas, and private villas",
        ],
        demoType: "portal",
        isHospitalityFeature: true,
        sortOrder: 3,
        status: "published",
      },
      {
        slug: "room-service-and-concierge",
        title: "Room Service and Concierge",
        subtitle: "Frictionless in-room dining and direct guest service requests",
        description:
          "Guests place in-room dining orders with delivery time preferences, custom dietary notes, and room number pre-populated. Orders land cleanly on staff screens or designated tablets.",
        icon: "Coffee",
        imageUrl: "/images/merqato-hospitality-portal.jpg",
        industrySlugs: ["hospitality"],
        features: [
          "Pre-configured room and suite identification on each tap",
          "Beverage pairings and snack suggestions during checkout",
          "Order status tracker (Received, Kitchen Preparing, On Its Way)",
          "Room charge or digital payment integration ready",
        ],
        benefits: [
          "Higher guest order completion without busy phone lines",
          "Fewer order errors caused by acoustic phone static or language barriers",
          "Upselling of evening cocktails and dessert selections",
        ],
        demoType: "concierge",
        isHospitalityFeature: true,
        sortOrder: 4,
        status: "published",
      },
      {
        slug: "tour-and-activity-booking",
        title: "Tour and Activity Booking",
        subtitle: "Showcase curated island hopping, diving, and wellness experiences",
        description:
          "Enable guests to explore Tour A, Tour C, scuba excursions, and spa treatments with real-time availability. Guests reserve spots directly from their sunbed or hotel room.",
        icon: "Compass",
        imageUrl: "/images/merqato-hero-tap.jpg",
        industrySlugs: ["hospitality", "tourism-and-marine"],
        features: [
          "Rich photo galleries and itinerary highlights for each local tour",
          "Instant booking confirmation with pickup time notifications",
          "Direct commission attribution for your resort concierge desk",
          "Equipment size questionnaires collected digitally prior to departure",
        ],
        benefits: [
          "Unlock lucrative tour commission revenue effortlessly",
          "Prevent last-minute tour sellouts during peak Palawan travel season",
          "Guests enjoy verified, high-quality partner operators with clear safety records",
        ],
        demoType: "booking",
        isHospitalityFeature: true,
        sortOrder: 5,
        status: "published",
      },
      {
        slug: "customer-loyalty",
        title: "Customer Loyalty & VIP Club",
        subtitle: "Reward repeat patrons without physical plastic cards",
        description:
          "Tap-to-stamp digital loyalty that integrates into Apple Wallet and Google Wallet. Patrons accumulate visits for sunset cocktails, complimentary upgrades, and exclusive tasting invitations.",
        icon: "Award",
        imageUrl: "/images/merqato-product-tags.jpg",
        industrySlugs: ["hospitality", "restaurants-and-cafes"],
        features: [
          "Passbook / Wallet digital membership card creation in 1 tap",
          "Cryptographically verified taps prevent fraudulent stamp claiming",
          "Push notifications for happy hour specials and VIP tasting events",
          "Customer tier progression (Explorer, Insider, Ambassador)",
        ],
        benefits: [
          "38% higher repeat visit rate among registered loyalty guests",
          "No lost punch cards or plastic waste on Palawan's shores",
          "Direct opt-in customer database building for remarketing",
        ],
        demoType: "loyalty",
        isHospitalityFeature: true,
        sortOrder: 6,
        status: "published",
      },
      {
        slug: "guest-requests",
        title: "Instant Guest Requests",
        subtitle: "Extra towels, ice buckets, baggage assistance, and late checkout",
        description:
          "Empower guests to submit common amenity requests with a single tap. Requests are instantly dispatched to housekeeping or concierge messaging channels with location tags.",
        icon: "Bell",
        imageUrl: "/images/merqato-hospitality-portal.jpg",
        industrySlugs: ["hospitality"],
        features: [
          "One-click preset buttons: 'Fresh Towels', 'Ice Bucket', 'Luggage Help'",
          "Staff acknowledgment sent back to guest screen in real time",
          "Prioritized queue with response time SLA tracking",
          "Multilingual support with automated English/Tagalog translation",
        ],
        benefits: [
          "Average request fulfillment time drops from 22 minutes to 8 minutes",
          "Guests feel pampered without awkward phone interactions",
          "Complete transparency for resort general managers on response times",
        ],
        demoType: "concierge",
        isHospitalityFeature: true,
        sortOrder: 7,
        status: "published",
      },
      {
        slug: "housekeeping-management",
        title: "Housekeeping & Room Status",
        subtitle: "Tap-to-verify cleaning workflows and maintenance dispatch",
        description:
          "Housekeeping staff tap smart tags at room entry and exit to log cleaning duration, report plumbing/AC issues with photos, and toggle room status to 'Inspected & Ready' on the supervisor board.",
        icon: "Sparkles",
        imageUrl: "/images/merqato-product-tags.jpg",
        industrySlugs: ["hospitality", "property-and-facilities"],
        features: [
          "Proof-of-presence NFC tap: verifies room was physically entered and inspected",
          "Checklist completion with instant photo capture of maintenance issues",
          "Automatic front desk notification when room is ready for early check-in",
          "Linen exchange and minibar restock logging",
        ],
        benefits: [
          "Eliminate walkie-talkie noise in guest corridors",
          "Faster room turnover during 11:00 AM - 2:00 PM turnaround window",
          "Accountability and fair workload distribution across cleaning staff",
        ],
        demoType: "tracking",
        isHospitalityFeature: true,
        sortOrder: 8,
        status: "published",
      },
      {
        slug: "equipment-and-rental-tracking",
        title: "Equipment and Rental Tracking",
        subtitle: "Paddleboards, snorkeling gear, golf carts, and dive regulators",
        description:
          "Affix weatherproof NFC tags to resort rental assets. Staff tap to check gear out to room numbers, log return conditions, and schedule periodic rinse and maintenance cycles.",
        icon: "ShieldCheck",
        imageUrl: "/images/merqato-industrial-tag.jpg",
        industrySlugs: ["hospitality", "equipment-rentals", "tourism-and-marine"],
        features: [
          "Waterproof marine-grade encapsulation tested for saltwater immersion",
          "Guest mobile tap opens gear liability waiver and safety instructions",
          "Automated return overdue reminders and deposit releases",
          "Service log history for life-safety diving equipment",
        ],
        benefits: [
          "Zero lost or unaccounted resort recreational assets",
          "Documented guest safety waivers protecting venue liability",
          "Extended equipment lifespan through scheduled preventative maintenance",
        ],
        demoType: "tracking",
        isHospitalityFeature: true,
        sortOrder: 9,
        status: "published",
      },
    ]);

    // 5. Physical Products Catalog
    await db.insert(products).values([
      {
        slug: "round-nfc-stickers",
        name: "Round NFC Smart Stickers",
        category: "stickers",
        tagline: "Ultra-thin, waterproof adhesive smart tags for counters and surfaces",
        description:
          "Engineered for high-traffic commercial environments. Features high-grade NXP NTAG213 silicon with on-metal ferrite shielding available. Adheres seamlessly to glass, wood, laminated menus, and plastic surfaces.",
        imageUrl: "/images/merqato-nfc-stickers-macro.jpg",
        galleryUrls: ["/images/merqato-product-tags.jpg", "/images/merqato-hero-tap.jpg"],
        dimensions: "25mm / 30mm / 40mm diameter",
        materials: "Matte PET finish with 3M 300LSE industrial adhesive",
        operatingRange: "15mm - 35mm reading distance",
        chipType: "NXP NTAG213 / NTAG215 (NFC Forum Type 2)",
        waterproofRating: "IP67 Weatherproof",
        applications: [
          "Restaurant laminated menus",
          "Bar counter service zones",
          "In-room bedside directories",
          "Product packaging and retail displays",
        ],
        variants: [
          { name: "Standard 30mm White Matte", finish: "Matte White", dimensions: "30mm Ø", minOrder: "50 units", estPrice: "₱65 / unit" },
          { name: "30mm Stealth Charcoal", finish: "Matte Black", dimensions: "30mm Ø", minOrder: "50 units", estPrice: "₱75 / unit" },
          { name: "30mm On-Metal Anti-Interference", finish: "Matte Black w/ Ferrite", dimensions: "30mm Ø", minOrder: "50 units", estPrice: "₱95 / unit" },
        ],
        specSheetUrl: "/docs/merqato-round-nfc-stickers-spec.pdf",
        isFeatured: true,
        sortOrder: 1,
        status: "published",
      },
      {
        slug: "rectangular-nfc-stickers",
        name: "Rectangular NFC Asset Stickers",
        category: "stickers",
        tagline: "Versatile rectangular format with prominent hybrid QR print",
        description:
          "Combines an embedded high-readability NFC antenna with high-contrast laser-printed QR codes. Perfect for equipment casings, room doors, appliance panels, and retail product boxes.",
        imageUrl: "/images/merqato-product-tags.jpg",
        galleryUrls: ["/images/merqato-product-tags.jpg", "/images/merqato-industrial-tag.jpg"],
        dimensions: "50mm x 30mm / 85mm x 54mm",
        materials: "High-density polymer with UV-resistant matte laminate",
        operatingRange: "20mm - 40mm reading distance",
        chipType: "NXP NTAG213 with 144 bytes user memory",
        waterproofRating: "IP68 Dust & Water Immersion",
        applications: [
          "Air conditioner and appliance manuals in rental villas",
          "Boat helm and marine gear safety checklists",
          "Conference room tables and AV panels",
        ],
        variants: [
          { name: "Compact 50x30mm", finish: "Industrial Matte Grey", dimensions: "50x30mm", minOrder: "50 units", estPrice: "₱85 / unit" },
          { name: "Full Card 85x54mm", finish: "Matte Black & Gold Accent", dimensions: "85x54mm", minOrder: "25 units", estPrice: "₱140 / unit" },
        ],
        specSheetUrl: "/docs/merqato-rectangular-stickers-spec.pdf",
        isFeatured: false,
        sortOrder: 2,
        status: "published",
      },
      {
        slug: "qr-stickers",
        name: "Ultra-Resilient QR Smart Stickers",
        category: "stickers",
        tagline: "High-contrast, scratch-proof QR codes with cloud redirect intelligence",
        description:
          "For camera-first workflows and environments with mixed device compatibility. Protected by a thick anti-scratch polycarbonate dome that withstands daily sanitizing alcohol and outdoor tropical sunlight.",
        imageUrl: "/images/merqato-product-tags.jpg",
        galleryUrls: ["/images/merqato-product-tags.jpg"],
        dimensions: "35mm x 35mm / 50mm x 50mm",
        materials: "Anti-scratch crystal dome with metallic backing",
        operatingRange: "Optical scan from 10cm - 150cm",
        chipType: "Cloud-Redirected Dynamic QR (URL re-targetable anytime)",
        waterproofRating: "IP68 Submersible",
        applications: [
          "Outdoor poolside tables exposed to rain and sun",
          "Beach umbrellas and cabanas",
          "Rental kayaks and paddleboards",
        ],
        variants: [
          { name: "Domed Square 35mm", finish: "Polycarbonate Gloss Dome", dimensions: "35x35mm", minOrder: "100 units", estPrice: "₱45 / unit" },
          { name: "Domed Square 50mm", finish: "Polycarbonate Gloss Dome", dimensions: "50x50mm", minOrder: "100 units", estPrice: "₱60 / unit" },
        ],
        specSheetUrl: "/docs/merqato-qr-stickers-spec.pdf",
        isFeatured: false,
        sortOrder: 3,
        status: "published",
      },
      {
        slug: "tabletop-standups",
        name: "NFC Palawan Island Tabletop Smart Standups",
        category: "tabletop",
        tagline: "Architectural solid wood and brushed aluminum table discs & tents",
        description:
          "Our flagship hospitality hardware piece. Crafted from sustainably sourced Philippine mahogany, solid teak, or weighted anodized aluminum. Houses an encapsulated NFC transmitter and micro-engraved QR pattern with custom venue branding.",
        imageUrl: "/images/merqato-standup-teak.jpg",
        galleryUrls: ["/images/merqato-hero-tap.jpg", "/images/merqato-hospitality-portal.jpg"],
        dimensions: "80mm Ø circular disc / 120mm x 70mm angled tent",
        materials: "Solid Palawan Teak / Anodized Space Charcoal Aluminum",
        operatingRange: "30mm - 50mm comfortable tap clearance",
        chipType: "NXP NTAG215 with anti-tamper lock",
        waterproofRating: "IP68 Sealed internal chamber",
        applications: [
          "Resort restaurant dining tables and beach bar counters",
          "Hotel bedside nightstands and reception check-in desks",
          "Executive boardroom desks and lounge coffee tables",
        ],
        variants: [
          { name: "Circular Teak Wood Disc (80mm)", finish: "Natural Teak Oil & Brass Engraving", dimensions: "80mm Ø x 8mm", minOrder: "10 units", estPrice: "₱480 / unit" },
          { name: "Weighted Anodized Aluminum Tent", finish: "Matte Charcoal Anodized", dimensions: "120x70x45mm", minOrder: "10 units", estPrice: "₱620 / unit" },
          { name: "Clear Acrylic Minimalist Tower", finish: "Flame-polished Cast Acrylic", dimensions: "100x60x12mm", minOrder: "15 units", estPrice: "₱390 / unit" },
        ],
        specSheetUrl: "/docs/merqato-tabletop-standups-spec.pdf",
        isFeatured: true,
        sortOrder: 4,
        status: "published",
      },
      {
        slug: "nfc-cards",
        name: "NFC Palawan Island Premium NFC Smart Cards",
        category: "cards",
        tagline: "Ultra-sleek hotel room keycards and digital business credentials",
        description:
          "Crafted from premium matte PVC, recycled ocean-bound plastic, or FSC-certified real bamboo wood. Doubles as hotel room entry credential and instant concierge tap portal.",
        imageUrl: "/images/merqato-product-tags.jpg",
        galleryUrls: ["/images/merqato-product-tags.jpg"],
        dimensions: "85.6mm x 53.98mm (Standard CR80 credit card format)",
        materials: "Matte Black PVC / Eco-friendly Solid Bamboo / Recycled PET",
        operatingRange: "25mm - 45mm reading distance",
        chipType: "Dual-Frequency Option: NTAG213 + MIFARE Classic 1K / EV1",
        waterproofRating: "IP68 Waterproof",
        applications: [
          "Smart resort room keycards with interactive guest services",
          "VIP member cards and resort credit passes",
          "Digital business cards for hotel managers and tour captains",
        ],
        variants: [
          { name: "Solid Bamboo Wood Card", finish: "Laser Engraved Carbonized Bamboo", dimensions: "CR80 (85.6x54mm)", minOrder: "50 units", estPrice: "₱180 / unit" },
          { name: "Matte Black Minimalist PVC", finish: "Soft-touch Velvet Matte", dimensions: "CR80 (85.6x54mm)", minOrder: "100 units", estPrice: "₱110 / unit" },
        ],
        specSheetUrl: "/docs/merqato-nfc-cards-spec.pdf",
        isFeatured: true,
        sortOrder: 5,
        status: "published",
      },
      {
        slug: "nfc-wristbands",
        name: "NFC Palawan Island Marine & Event NFC Wristbands",
        category: "wristbands",
        tagline: "Waterproof silicone and woven fabric wristbands for guests and crew",
        description:
          "Designed for all-day beach and island wear. Saltwater-proof, sun-resistant, and comfortable. Perfect for resort day passes, island hopping tour groups, and all-inclusive beverage verification.",
        imageUrl: "/images/merqato-product-tags.jpg",
        galleryUrls: ["/images/merqato-product-tags.jpg"],
        dimensions: "Adjustable 220mm length / Elastic stretch sizes",
        materials: "Food-grade hypoallergenic silicone / Recycled woven fabric",
        operatingRange: "20mm - 35mm reading distance",
        chipType: "NTAG213 encapsulated in hermetically sealed disc",
        waterproofRating: "IP68 Submersible to 10 meters depth",
        applications: [
          "Resort pool & beach club day guest identification",
          "Island hopping tour group check-in and emergency contacts",
          "VIP festival and private retreat access control",
        ],
        variants: [
          { name: "Smooth Silicone Band (Adjustable)", finish: "Matte Slate / Sand / Ocean Teal", dimensions: "240x18mm", minOrder: "100 units", estPrice: "₱95 / unit" },
          { name: "Woven Festival Fabric Band w/ Slider", finish: "Custom Full-Color Weave", dimensions: "350x15mm", minOrder: "200 units", estPrice: "₱65 / unit" },
        ],
        specSheetUrl: "/docs/merqato-wristbands-spec.pdf",
        isFeatured: false,
        sortOrder: 6,
        status: "published",
      },
      {
        slug: "secure-nfc-tags",
        name: "NFC Palawan Island Secure Cryptographic NFC Tags",
        category: "secure_tags",
        tagline: "Anti-counterfeiting and dynamic authentication with NXP NTAG 424 DNA",
        description:
          "Generates a unique cryptographic AES-128 code on every single tap. Verifies physical presence and authenticates luxury craft products, certificates of authenticity, and high-security access zones without risk of cloning.",
        imageUrl: "/images/merqato-product-tags.jpg",
        galleryUrls: ["/images/merqato-product-tags.jpg", "/images/merqato-industrial-tag.jpg"],
        dimensions: "30mm circular tag or embedded tamper-evident seal",
        materials: "Tamper-evident destructible substrate or robust ABS shell",
        operatingRange: "20mm - 40mm reading distance",
        chipType: "NXP NTAG 424 DNA with SUN (Secure Unique NFC Message)",
        waterproofRating: "IP67 Weatherproof",
        applications: [
          "High-value Palawan pearls and artisanal craft certification",
          "Guard patrol proof-of-presence inspection points",
          "Tamper-evident warranty seals on high-end electronics",
        ],
        variants: [
          { name: "Tamper-Evident Destructible Seal", finish: "Silver Holographic Destructible", dimensions: "35x20mm", minOrder: "200 units", estPrice: "₱140 / unit" },
          { name: "Rigid Encapsulated ABS Token", finish: "Ultrasonic Welded Black ABS", dimensions: "30mm Ø x 4mm", minOrder: "50 units", estPrice: "₱190 / unit" },
        ],
        specSheetUrl: "/docs/merqato-secure-tags-spec.pdf",
        isFeatured: false,
        sortOrder: 7,
        status: "published",
      },
      {
        slug: "specialized-asset-labels",
        name: "Specialized Marine & Industrial Asset Labels",
        category: "asset_labels",
        tagline: "Extreme-durability tags for solar inverters, boat hulls, and machinery",
        description:
          "Built to endure torrential monsoons, direct equatorial UV radiation, diesel fuel, and saltwater spray. Laser-engraved anodized aluminum or polycarbonate plate with dual rivet mounting holes and heavy-duty 3M VHB bonding.",
        imageUrl: "/images/merqato-industrial-tag.jpg",
        galleryUrls: ["/images/merqato-industrial-tag.jpg", "/images/merqato-product-tags.jpg"],
        dimensions: "85mm x 55mm / 60mm x 30mm with screw holes",
        materials: "Anodized Heavy Aluminum plate with high-temp ferrite backing",
        operatingRange: "30mm - 60mm high-penetration reading",
        chipType: "High-temperature ICODE SLIX2 / NTAG216",
        waterproofRating: "IP69K High-pressure washdown resistant",
        applications: [
          "Solar battery racks, off-grid inverters, and generator sets",
          "Commercial dive boat engines and hull maintenance logs",
          "Heavy construction equipment and rental vehicle tracking",
        ],
        variants: [
          { name: "Rivet-Mount Anodized Aluminum Plate", finish: "Matte Black Hard Anodized", dimensions: "85x54x1.5mm", minOrder: "20 units", estPrice: "₱320 / unit" },
          { name: "Flexible High-Tack Marine Polyurethane Tag", finish: "UV-Stabilized Black Polyurethane", dimensions: "60x30x2.5mm", minOrder: "50 units", estPrice: "₱160 / unit" },
        ],
        specSheetUrl: "/docs/merqato-asset-labels-spec.pdf",
        isFeatured: true,
        sortOrder: 8,
        status: "published",
      },
    ]);

    // 6. Pages CMS
    await db.insert(pages).values([
      {
        slug: "home",
        title: "Home",
        metaTitle: "NFC Palawan Island | Make Every Tap Count — Connected Business Experiences",
        metaDescription:
          "Turn everyday objects into powerful business tools. NFC Palawan Island connects physical places, products, and equipment to useful digital experiences via NFC & QR.",
        heroHeadline: "Make Every Tap Count.",
        heroSubheadline: "Turn everyday objects into powerful business tools.",
        heroDescription:
          "NFC Palawan Island connects physical places, products, and equipment to useful digital experiences through QR codes, NFC technology, and connected business software.",
        status: "published",
        sectionsContent: {
          pilotHeadline: "Join the Palawan Connected Hospitality Pilot",
          pilotPricePhp: 1000,
          pilotDurationDays: 90,
          howItWorksSteps: [
            { step: "01", title: "Tap or scan a smart tag", description: "No app downloads, no friction. A simple tap of a guest's smartphone on an elegant NFC Palawan Island wooden or acrylic tabletop tag." },
            { step: "02", title: "Open the connected digital experience", description: "In under 600 milliseconds, an intuitive mobile-web portal opens with your venue's branded identity, live menus, and concierge tools." },
            { step: "03", title: "Book, order, interact, or complete a task", description: "The guest orders food, requests towels, writes a 5-star Google review, or books an island tour seamlessly." },
          ],
        },
      },
      {
        slug: "about",
        title: "About NFC Palawan Island",
        metaTitle: "About NFC Palawan Island | Palawan Collective",
        metaDescription:
          "Born in Palawan, Philippines, NFC Palawan Island designs connected physical-to-digital tools for hospitality and enterprise operations.",
        heroHeadline: "Connecting the Physical World to Useful Digital Action",
        heroSubheadline: "Developed by Palawan Collective",
        heroDescription:
          "We believe physical spaces should communicate effortlessly. NFC Palawan Island bridges tactile industrial design with lightning-fast cloud software, starting from the world-class islands of Palawan.",
        status: "published",
        sectionsContent: {
          mission: "To eliminate friction between people and the physical environments they navigate every day.",
          vision: "A world where every table, product, machine, and destination has an intelligent, instant voice.",
        },
      },
      {
        slug: "pilot-program",
        title: "Hospitality Pilot Program",
        metaTitle: "90-Day Hospitality Pilot Program | NFC Palawan Island Palawan",
        metaDescription:
          "Experience NFC Palawan Island with our 90-day trial for ₱1,000 setup commitment. Limited to 20 hospitality venues across Palawan.",
        heroHeadline: "Experience Connected Hospitality for 90 Days.",
        heroSubheadline: "₱1,000 Setup Commitment. Zero Recurring Fees During Trial.",
        heroDescription:
          "Test NFC Palawan Island in your dining rooms, poolside cabanas, and hotel suites. Measure guest satisfaction, Google Review growth, and order velocity with zero ongoing risk.",
        status: "published",
        sectionsContent: {},
      },
      {
        slug: "how-it-works",
        title: "How It Works",
        metaTitle: "How It Works | NFC Palawan Island NFC & QR Architecture",
        metaDescription:
          "Understand the three-step physical-to-digital flow powering NFC Palawan Island's connected business experiences.",
        heroHeadline: "Frictionless Architecture. Instant Interaction.",
        heroSubheadline: "From physical touch to cloud action in under one second.",
        heroDescription:
          "Discover how passive NFC microchips, precision QR encoding, and ultra-fast edge web applications work together seamlessly.",
        status: "published",
        sectionsContent: {},
      },
    ]);

    // 7. Initial Insights / Articles
    await db.insert(insights).values([
      {
        slug: "why-nfc-outperforms-standalone-qr-hospitality",
        title: "Why NFC Outperforms Standalone QR in High-End Hospitality",
        category: "Technology & Experience",
        summary:
          "Camera scanning fatigue is real. Discover how physical tap interactions elevate perceived brand prestige and increase guest engagement by 64% in luxury resort dining.",
        content: `In luxury hospitality, every touchpoint communicates care and refinement. While the early 2020s popularized quick-response codes out of sudden necessity, printed paper QR sheets taped to dining tables often conveyed a sterile, low-cost impression.

Near Field Communication (NFC) completely changes this dynamic. When embedded into solid Philippine teak, weighted brushed aluminum, or organic limestone discs, the interaction feels magical: a guest simply rests their smartphone over the emblem, and the digital guest portal opens immediately—no camera viewfinder gymnastics, no awkward angle adjustments in dim candlelit settings, and no glare reflections.

Beyond aesthetics, tap completion rates in field tests conducted in El Nido and Puerto Princesa demonstrated a 64% increase in total guest interactions when both NFC and backup QR were present on the same tactile standup. Guests view NFC as an intentional amenity rather than a temporary workaround.`,
        author: "Palawan Collective Engineering",
        readTime: "4 min read",
        coverImage: "/images/merqato-hero-tap.jpg",
        status: "published",
      },
      {
        slug: "frictionless-guest-cutting-wait-times-palawan-resorts",
        title: "The Frictionless Guest: Cutting Resort Service Bottlenecks",
        category: "Operational Efficiency",
        summary:
          "How boutique eco-resorts in Palawan are eliminating reception desk phone-tag, accelerating poolside beverage re-orders, and capturing record Google Reviews.",
        content: `During peak tourist seasons, Palawan's boutique island resorts operate under tight staffing ratios. Reception phones ring constantly with simple inquiries: 'What is the Wi-Fi password?', 'Can we get two extra beach towels at Cabana 4?', or 'What time does the sunset boat depart?'

Every phone call interrupts front-desk staff who are in the middle of welcoming checking-in guests.

By deploying NFC Palawan Island connected smart tags across guest suites, pool decks, and dining verandas, venues centralize 80% of routine inquiries into an ultra-fast digital portal. Guests tap to order, request amenities, or view island tide schedules. Staff receive structured notifications on their mobile tablets, eliminating misheard requests and unnecessary foot travel across sprawling resort grounds.`,
        author: "Hospitality Strategy Group",
        readTime: "5 min read",
        coverImage: "/images/merqato-hospitality-portal.jpg",
        status: "published",
      },
      {
        slug: "rugged-asset-tagging-tropical-marine-environments",
        title: "Rugged Asset Tagging in Tropical Marine Environments",
        category: "Industrial Hardware",
        summary:
          "Saltwater spray, equatorial humidity, and tropical heat degrade standard labels within weeks. Here is how NFC Palawan Island engineers resilient hardware for island operations.",
        content: `Operating marine tour fleets, solar microgrids, and rental recreational equipment in Palawan poses extreme environmental tests. High ambient humidity, constant airborne sea salt, intense ultraviolet radiation, and heavy seasonal rainfall destroy standard paper or consumer-grade plastic stickers within 30 to 60 days.

NFC Palawan Island specialized industrial tags utilize ultrasonic-sealed ABS casings, ferrite anti-metal isolation layers, and high-tenacity 3M VHB bonding to withstand years of harsh island exposure.

Field testing on commercial dive catamarans in Coron verified zero signal degradation or adhesive peeling after 12 months of daily saltwater spray and engine vibrations.`,
        author: "Materials & Industrial Design Lab",
        readTime: "6 min read",
        coverImage: "/images/merqato-industrial-tag.jpg",
        status: "published",
      },
    ]);

    // 8. Sample Starter Inquiries / Leads (clearly labeled for admin review)
    await db.insert(leads).values([
      {
        businessName: "El Nido Bayview Eco Sanctuary",
        contactName: "Mateo Rodriguez",
        email: "operations@elnidobayview.sample",
        phone: "+63 917 555 1201",
        industry: "Hospitality & Resorts",
        location: "El Nido, Palawan",
        interestedSolutions: ["Hotel guest portals", "Google review collection", "Room service and concierge"],
        productInquirySlug: "tabletop-standups",
        message: "We have 18 beachfront villas and an open-air pavilion restaurant. Interested in joining the 90-day pilot program for our high season.",
        sourceUrl: "/pilot-program",
        status: "pilot_offer",
        notes: [
          { author: "Palawan Collective Admin", text: "Verified venue in El Nido. Sent pilot hardware kit specification sheet.", createdAt: new Date().toISOString() },
        ],
        consentGiven: true,
      },
      {
        businessName: "Coron Island Catamaran Expeditions",
        contactName: "Capt. Jerry Alcantara",
        email: "bookings@coroncatamaran.sample",
        phone: "+63 920 888 3492",
        industry: "Tourism and Marine",
        location: "Coron, Palawan",
        interestedSolutions: ["Tour and activity booking", "Equipment and rental tracking"],
        productInquirySlug: "specialized-asset-labels",
        message: "Looking for waterproof NFC tags on our 3 tour catamarans for guest safety waivers and snorkel gear inventory.",
        sourceUrl: "/industries/tourism-and-marine",
        status: "contacted",
        notes: [
          { author: "Palawan Collective Admin", text: "Inquired about saltwater resistance and Android compatibility.", createdAt: new Date().toISOString() },
        ],
        consentGiven: true,
      },
    ]);

    // 9. Initial Audit Log
    await db.insert(auditLogs).values([
      {
        adminEmail: "admin@merqato.digital",
        adminName: "Palawan Collective Admin",
        action: "create",
        entityType: "setting",
        entityId: "initial-seed",
        details: "Initial system configuration and database seeding completed.",
      },
    ]);

    console.log("NFC Palawan Island database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
