import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  customType,
} from "drizzle-orm/pg-core";

/**
 * Raw binary column.
 *
 * Uploaded files are kept in the database rather than on disk: a serverless
 * host has a read-only, ephemeral filesystem, so anything written to
 * `public/uploads` is lost and cannot be served. Reads happen through
 * `/api/files/[id]`.
 */
const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"), // 'owner' | 'admin' | 'editor' | 'viewer'
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  adminEmail: varchar("admin_email", { length: 255 }).notNull(),
  adminName: varchar("admin_name", { length: 255 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(), // 'create' | 'update' | 'delete' | 'publish' | 'archive' | 'restore' | 'login'
  entityType: varchar("entity_type", { length: 50 }).notNull(), // 'page' | 'industry' | 'use_case' | 'product' | 'lead' | 'setting' | 'media' | 'admin'
  entityId: varchar("entity_id", { length: 100 }),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: jsonb("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  heroHeadline: text("hero_headline"),
  heroSubheadline: text("hero_subheadline"),
  heroDescription: text("hero_description"),
  status: varchar("status", { length: 50 }).notNull().default("published"), // 'published' | 'draft' | 'archived'
  sectionsContent: jsonb("sections_content"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const industries = pgTable("industries", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  tagline: varchar("tagline", { length: 255 }),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }),
  imageUrl: text("image_url"),
  isPrimary: boolean("is_primary").default(false),
  sortOrder: integer("sort_order").default(0),
  status: varchar("status", { length: 50 }).notNull().default("published"), // 'published' | 'draft' | 'archived'
  benefits: jsonb("benefits"), // string[] or {title, description}[]
  exampleDeployments: jsonb("example_deployments"), // {title, venueType, outcome}[]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const useCases = pgTable("use_cases", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }),
  imageUrl: text("image_url"),
  industrySlugs: jsonb("industry_slugs"), // string[] of industry slugs
  features: jsonb("features"), // string[]
  benefits: jsonb("benefits"), // string[]
  demoType: varchar("demo_type", { length: 50 }), // 'menu' | 'review' | 'portal' | 'concierge' | 'booking' | 'tracking' | 'loyalty'
  isHospitalityFeature: boolean("is_hospitality_feature").default(false),
  sortOrder: integer("sort_order").default(0),
  status: varchar("status", { length: 50 }).notNull().default("published"), // 'published' | 'draft' | 'archived'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // 'stickers' | 'tabletop' | 'cards' | 'wristbands' | 'asset_labels' | 'secure_tags'
  tagline: varchar("tagline", { length: 255 }),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  galleryUrls: jsonb("gallery_urls"),
  dimensions: varchar("dimensions", { length: 100 }),
  materials: varchar("materials", { length: 255 }),
  operatingRange: varchar("operating_range", { length: 100 }),
  chipType: varchar("chip_type", { length: 100 }),
  waterproofRating: varchar("waterproof_rating", { length: 50 }),
  applications: jsonb("applications"), // string[]
  variants: jsonb("variants"), // {name, dimensions, finish, minOrder, estPrice}[]
  specSheetUrl: text("spec_sheet_url"),
  isFeatured: boolean("is_featured").default(false),
  sortOrder: integer("sort_order").default(0),
  status: varchar("status", { length: 50 }).notNull().default("published"), // 'published' | 'draft' | 'archived'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 100 }),
  industry: varchar("industry", { length: 100 }),
  location: varchar("location", { length: 255 }),
  interestedSolutions: jsonb("interested_solutions"), // string[]
  productInquirySlug: varchar("product_inquiry_slug", { length: 100 }),
  message: text("message"),
  sourceUrl: varchar("source_url", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull().default("new"), // 'new' | 'contacted' | 'qualified' | 'pilot_offer' | 'closed' | 'archived'
  notes: jsonb("notes"), // {author: string, text: string, createdAt: string}[]
  consentGiven: boolean("consent_given").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mediaItems = pgTable("media_items", {
  id: serial("id").primaryKey(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  altText: varchar("alt_text", { length: 255 }),
  category: varchar("category", { length: 100 }).default("general"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const uploadedFiles = pgTable("uploaded_files", {
  id: serial("id").primaryKey(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(),
  data: bytea("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  author: varchar("author", { length: 100 }).notNull(),
  readTime: varchar("read_time", { length: 50 }).notNull(),
  coverImage: text("cover_image"),
  status: varchar("status", { length: 50 }).notNull().default("published"),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
