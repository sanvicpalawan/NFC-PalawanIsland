/* Editorial defaults for the preview catalogue. These are scenarios, not customer
 * results or guarantees. Once seeded, every field is editable in /admin/industries. */
export const previewIndustryCopy: Record<
  string,
  { tagline: string; description: string; benefits: string[] }
> = {
  hospitality: {
    tagline: "More attentive stays, with fewer handoffs.",
    description:
      "Place a considered NFC or QR touchpoint in rooms, restaurants, and shared spaces. Guests can open useful information, browse a menu, or request help in their own time—while your team keeps the journey clear.",
    benefits: [
      "Keep guest information current without reprinting room guides",
      "Give guests a simple way to ask for help where they are",
      "Connect dining, concierge, and guest requests in one experience",
    ],
  },
  "restaurants-and-cafes": {
    tagline: "A more useful moment at every table.",
    description:
      "A discreet tag can open a current menu, share ingredient details, or make it easier to ask for service. Update information in one place and keep the experience as considered as the space around it.",
    benefits: [
      "Refresh menus and specials without reprinting cards",
      "Make it easier to request service or the bill",
      "Offer review and loyalty touchpoints at natural moments",
    ],
  },
  "tourism-and-marine": {
    tagline: "Clear information from shore to sea.",
    description:
      "Put itineraries, safety information, booking details, and equipment guidance within reach at the dock, on board, or at the tour counter. Choose hardware suited to the environment.",
    benefits: [
      "Keep trip guidance and safety information accessible",
      "Make waivers and boarding details easier to find",
      "Connect equipment to its instructions and service notes",
    ],
  },
  "property-and-facilities": {
    tagline: "Useful building information, exactly where it belongs.",
    description:
      "Connect rooms, shared amenities, and equipment to relevant guides and service requests. Residents, guests, and teams can find what they need without tracking down a paper manual.",
    benefits: [
      "Keep access instructions and house guides in one place",
      "Let maintenance requests point to a specific location",
      "Make shared-facility information easier to maintain",
    ],
  },
  "solar-and-energy": {
    tagline: "A clearer identity for every installation.",
    description:
      "Link panels, inverters, batteries, and service points to product information, handover documents, and maintenance notes. The right record stays close to the physical asset.",
    benefits: [
      "Keep handover documents with the installed equipment",
      "Make product details available to service teams on site",
      "Organise maintenance notes around identifiable assets",
    ],
  },
  "equipment-rentals": {
    tagline: "Put the right instructions with the right item.",
    description:
      "A durable tag on each rental item can open operating guidance, return information, or a request for help. Staff and customers get a clearer reference point across the rental journey.",
    benefits: [
      "Keep item guidance and return details easy to access",
      "Make condition and service notes easier to organise",
      "Give renters a direct route to help when needed",
    ],
  },
  "manufacturing-and-product-identity": {
    tagline: "Give products a story that stays with them.",
    description:
      "Connect packaging and products to origin information, care guides, certificates, and support. A physical product becomes an ongoing point of contact with the people who use it.",
    benefits: [
      "Keep product guidance available beyond the packaging",
      "Share provenance and supporting documents clearly",
      "Create a route to after-sales help and reordering",
    ],
  },
  "logistics-and-supply-chains": {
    tagline: "Make every handover easier to understand.",
    description:
      "Link containers, pallets, and consignments to handling instructions and handover information. The physical label becomes a starting point for the next person in the chain.",
    benefits: [
      "Keep handling instructions close to the shipment",
      "Make handover details available at the point of transfer",
      "Help teams identify the right consignment information",
    ],
  },
  "events-and-experiences": {
    tagline: "Connect the moments people came for.",
    description:
      "Use signage, cards, and wristbands to open programmes, maps, schedules, and useful information. Make it easier for guests to find their way and engage on their own terms.",
    benefits: [
      "Keep programmes and location information current",
      "Offer a simple way to explore sessions and venues",
      "Connect physical passes to relevant digital information",
    ],
  },
};
