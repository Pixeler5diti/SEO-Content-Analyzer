import { seoAnalyses, type SeoAnalysis, type InsertSeoAnalysis } from "@shared/schema";

export interface IStorage {
  createSeoAnalysis(analysis: InsertSeoAnalysis): Promise<SeoAnalysis>;
  getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined>;
  updateSeoAnalysis(id: number, updates: Partial<InsertSeoAnalysis>): Promise<SeoAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private analyses: Map<number, SeoAnalysis>;
  private currentId: number;

  constructor() {
    this.analyses = new Map();
    this.currentId = 1;
  }

  async createSeoAnalysis(insertAnalysis: InsertSeoAnalysis): Promise<SeoAnalysis> {
    const id = this.currentId++;
    const analysis: SeoAnalysis = { ...insertAnalysis, id };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined> {
    return this.analyses.get(id);
  }

  async updateSeoAnalysis(id: number, updates: Partial<InsertSeoAnalysis>): Promise<SeoAnalysis | undefined> {
    const existing = this.analyses.get(id);
    if (!existing) return undefined;
    
    const updated: SeoAnalysis = { ...existing, ...updates };
    this.analyses.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
