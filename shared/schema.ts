import { pgTable, text, serial, integer, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const seoAnalyses = pgTable("seo_analyses", {
  id: serial("id").primaryKey(),
  originalText: text("original_text").notNull(),
  contentType: text("content_type").notNull().default("blog_post"),
  seoScore: real("seo_score"),
  readabilityScore: text("readability_score"),
  keywordDensity: real("keyword_density"),
  wordCount: integer("word_count"),
  recommendations: jsonb("recommendations").$type<Array<{
    type: string;
    title: string;
    description: string;
  }>>(),
  keywords: jsonb("keywords").$type<Array<{
    text: string;
    difficulty: string;
    volume: string;
    context: string;
    relevanceScore: number;
  }>>(),
  optimizedText: text("optimized_text"),
});

export const insertSeoAnalysisSchema = createInsertSchema(seoAnalyses).omit({
  id: true,
});

export const analyzeSeoRequestSchema = z.object({
  text: z.string().min(10, "Text must be at least 10 characters long"),
  contentType: z.enum(["blog_post", "social_media", "newsletter", "product_description"]).default("blog_post"),
});

export const insertKeywordRequestSchema = z.object({
  analysisId: z.number(),
  keyword: z.string(),
  text: z.string(),
});

export type InsertSeoAnalysis = z.infer<typeof insertSeoAnalysisSchema>;
export type SeoAnalysis = typeof seoAnalyses.$inferSelect;
export type AnalyzeSeoRequest = z.infer<typeof analyzeSeoRequestSchema>;
export type InsertKeywordRequest = z.infer<typeof insertKeywordRequestSchema>;
