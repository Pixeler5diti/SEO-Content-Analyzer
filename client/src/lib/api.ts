import { apiRequest } from "./queryClient";
import type { AnalyzeSeoRequest, InsertKeywordRequest, SeoAnalysis } from "@shared/schema";

export async function analyzeSeo(data: AnalyzeSeoRequest): Promise<SeoAnalysis> {
  const response = await apiRequest("POST", "/api/analyze", data);
  return response.json();
}

export async function insertKeyword(data: InsertKeywordRequest): Promise<{ optimizedText: string; analysis: SeoAnalysis }> {
  const response = await apiRequest("POST", "/api/insert-keyword", data);
  return response.json();
}

export async function getAnalysis(id: number): Promise<SeoAnalysis> {
  const response = await apiRequest("GET", `/api/analysis/${id}`);
  return response.json();
}
