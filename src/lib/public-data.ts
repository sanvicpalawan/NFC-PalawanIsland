import { db } from "@/db";
import {
  siteSettings,
  industries,
  useCases,
  products,
  pages,
  insights,
} from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";

export async function getSiteSettings() {
  try {
    const list = await db.select().from(siteSettings);
    const map: Record<string, any> = {};
    for (const item of list) {
      map[item.key] = item.value;
    }
    return map;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return {};
  }
}

export async function getIndustries() {
  try {
    return await db
      .select()
      .from(industries)
      .where(eq(industries.status, "published"))
      .orderBy(asc(industries.sortOrder));
  } catch (error) {
    console.error("Error fetching industries:", error);
    return [];
  }
}

export async function getIndustryBySlug(slug: string) {
  try {
    const res = await db
      .select()
      .from(industries)
      .where(eq(industries.slug, slug))
      .limit(1);
    return res[0] || null;
  } catch (error) {
    console.error(`Error fetching industry ${slug}:`, error);
    return null;
  }
}

export async function getUseCases(industrySlug?: string) {
  try {
    const list = await db
      .select()
      .from(useCases)
      .where(eq(useCases.status, "published"))
      .orderBy(asc(useCases.sortOrder));

    if (!industrySlug) return list;

    return list.filter((uc) => {
      const slugs = (uc.industrySlugs as string[]) || [];
      return slugs.includes(industrySlug);
    });
  } catch (error) {
    console.error("Error fetching use cases:", error);
    return [];
  }
}

export async function getUseCaseBySlug(slug: string) {
  try {
    const res = await db
      .select()
      .from(useCases)
      .where(eq(useCases.slug, slug))
      .limit(1);
    return res[0] || null;
  } catch (error) {
    console.error(`Error fetching use case ${slug}:`, error);
    return null;
  }
}

export async function getProducts(category?: string) {
  try {
    let query = db
      .select()
      .from(products)
      .where(eq(products.status, "published"))
      .orderBy(asc(products.sortOrder));

    const list = await query;
    if (!category || category === "all") return list;
    return list.filter((p) => p.category === category);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const res = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);
    return res[0] || null;
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const res = await db
      .select()
      .from(pages)
      .where(eq(pages.slug, slug))
      .limit(1);
    return res[0] || null;
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return null;
  }
}

export async function getInsights() {
  try {
    return await db
      .select()
      .from(insights)
      .where(eq(insights.status, "published"))
      .orderBy(desc(insights.publishedAt));
  } catch (error) {
    console.error("Error fetching insights:", error);
    return [];
  }
}

export async function getInsightBySlug(slug: string) {
  try {
    const res = await db
      .select()
      .from(insights)
      .where(eq(insights.slug, slug))
      .limit(1);
    return res[0] || null;
  } catch (error) {
    console.error(`Error fetching insight ${slug}:`, error);
    return null;
  }
}
