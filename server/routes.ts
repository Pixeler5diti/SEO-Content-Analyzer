import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSeoRequestSchema, insertKeywordRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Analyze SEO content
  app.post("/api/analyze", async (req, res) => {
    try {
      const { text, contentType } = analyzeSeoRequestSchema.parse(req.body);
      
      // Get Gemini API key from environment
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(400).json({ 
          message: "Gemini API key not configured. Please set GEMINI_API_KEY environment variable." 
        });
      }

      // Call Gemini API for analysis
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze the following ${contentType.replace('_', ' ')} content for SEO and provide keywords, entities, and topics. Return your analysis in the following JSON format:

{
  "keywords": [
    {
      "text": "keyword phrase",
      "relevanceScore": 0.8,
      "searchVolume": "high/medium/low",
      "difficulty": "high/medium/low"
    }
  ],
  "entities": [
    {
      "text": "entity name",
      "relevanceScore": 0.9,
      "type": "PERSON/ORGANIZATION/LOCATION/OTHER"
    }
  ],
  "topics": [
    {
      "text": "topic name",
      "relevanceScore": 0.7
    }
  ]
}

Content to analyze:
${text}`
            }]
          }]
        }),
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        return res.status(500).json({ 
          message: `Gemini API error: ${geminiResponse.status} - ${errorText}` 
        });
      }

      const geminiData = await geminiResponse.json();
      
      // Extract and parse the JSON response from Gemini
      let geminiAnalysis;
      try {
        const responseText = geminiData.candidates[0]?.content?.parts[0]?.text || "{}";
        // Extract JSON from the response (in case it's wrapped in markdown)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        geminiAnalysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError);
        geminiAnalysis = { keywords: [], entities: [], topics: [] };
      }
      
      // Process Gemini response and generate SEO metrics
      const wordCount = text.trim().split(/\s+/).length;
      const keywords = processGeminiKeywords(geminiAnalysis);
      const seoScore = calculateSeoScore(text, keywords, wordCount);
      const keywordDensity = calculateKeywordDensity(text, keywords);
      const readabilityScore = calculateReadabilityScore(text, wordCount);
      const recommendations = generateRecommendations(seoScore, wordCount, keywords);

      // Store analysis in memory
      const analysis = await storage.createSeoAnalysis({
        originalText: text,
        contentType,
        seoScore,
        readabilityScore,
        keywordDensity,
        wordCount,
        recommendations,
        keywords,
        optimizedText: text, // Initially same as original
      });

      res.json(analysis);
    } catch (error: any) {
      console.error("SEO analysis error:", error);
      res.status(500).json({ 
        message: error.message || "Failed to analyze content" 
      });
    }
  });

  // Insert keyword into text
  app.post("/api/insert-keyword", async (req, res) => {
    try {
      const { analysisId, keyword, text } = insertKeywordRequestSchema.parse(req.body);
      
      const analysis = await storage.getSeoAnalysis(analysisId);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      // Smart keyword insertion logic
      const optimizedText = insertKeywordIntelligently(text, keyword);
      
      // Update analysis with new optimized text
      const updatedAnalysis = await storage.updateSeoAnalysis(analysisId, {
        optimizedText,
      });

      res.json({ 
        optimizedText,
        analysis: updatedAnalysis 
      });
    } catch (error: any) {
      console.error("Keyword insertion error:", error);
      res.status(500).json({ 
        message: error.message || "Failed to insert keyword" 
      });
    }
  });

  // Get analysis by ID
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getSeoAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || "Failed to get analysis" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function processGeminiKeywords(geminiAnalysis: any): Array<{
  text: string;
  difficulty: string;
  volume: string;
  context: string;
  relevanceScore: number;
}> {
  const keywords: Array<{
    text: string;
    difficulty: string;
    volume: string;
    context: string;
    relevanceScore: number;
  }> = [];

  // Process keywords from Gemini
  if (geminiAnalysis.keywords && Array.isArray(geminiAnalysis.keywords)) {
    geminiAnalysis.keywords
      .filter((keyword: any) => keyword.relevanceScore > 0.3)
      .slice(0, 10) // Limit to top 10
      .forEach((keyword: any) => {
        const difficulty = keyword.difficulty || (keyword.relevanceScore > 0.8 ? "High" : keyword.relevanceScore > 0.6 ? "Medium" : "Low");
        const volume = keyword.searchVolume || `${Math.floor(keyword.relevanceScore * 15000)}`;
        
        keywords.push({
          text: keyword.text.toLowerCase(),
          difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
          volume: typeof volume === 'string' ? volume : `${volume}`,
          context: `Keyword with ${(keyword.relevanceScore * 100).toFixed(1)}% relevance`,
          relevanceScore: keyword.relevanceScore,
        });
      });
  }

  // Process entities as keywords
  if (geminiAnalysis.entities && Array.isArray(geminiAnalysis.entities)) {
    geminiAnalysis.entities
      .filter((entity: any) => entity.relevanceScore > 0.5)
      .slice(0, 5) // Limit to top 5
      .forEach((entity: any) => {
        keywords.push({
          text: entity.text.toLowerCase(),
          difficulty: entity.relevanceScore > 0.8 ? "High" : entity.relevanceScore > 0.6 ? "Medium" : "Low",
          volume: `${Math.floor(entity.relevanceScore * 12000)}`,
          context: `Entity (${entity.type}) with ${(entity.relevanceScore * 100).toFixed(1)}% relevance`,
          relevanceScore: entity.relevanceScore,
        });
      });
  }

  // Process topics as keywords  
  if (geminiAnalysis.topics && Array.isArray(geminiAnalysis.topics)) {
    geminiAnalysis.topics
      .filter((topic: any) => topic.relevanceScore > 0.4)
      .slice(0, 5) // Limit to top 5
      .forEach((topic: any) => {
        keywords.push({
          text: topic.text.toLowerCase(),
          difficulty: topic.relevanceScore > 0.7 ? "High" : topic.relevanceScore > 0.5 ? "Medium" : "Low",
          volume: `${Math.floor(topic.relevanceScore * 10000)}`,
          context: `Topic with ${(topic.relevanceScore * 100).toFixed(1)}% relevance`,
          relevanceScore: topic.relevanceScore,
        });
      });
  }

  return keywords.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function calculateSeoScore(text: string, keywords: any[], wordCount: number): number {
  let score = 50; // Base score
  
  // Word count factor
  if (wordCount > 300) score += 15;
  else if (wordCount > 150) score += 10;
  else if (wordCount > 50) score += 5;
  
  // Keyword relevance factor
  if (keywords.length > 5) score += 15;
  else if (keywords.length > 2) score += 10;
  
  // Sentence structure factor
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = wordCount / sentences.length;
  if (avgSentenceLength < 20 && avgSentenceLength > 10) score += 10;
  
  return Math.min(100, Math.max(0, score));
}

function calculateKeywordDensity(text: string, keywords: any[]): number {
  if (keywords.length === 0) return 0;
  
  const wordCount = text.trim().split(/\s+/).length;
  let keywordCount = 0;
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.text.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) keywordCount += matches.length;
  });
  
  return (keywordCount / wordCount) * 100;
}

function calculateReadabilityScore(text: string, wordCount: number): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = wordCount / sentences.length;
  
  if (avgSentenceLength < 15) return "Easy";
  if (avgSentenceLength < 20) return "Good";
  if (avgSentenceLength < 25) return "Fair";
  return "Difficult";
}

function generateRecommendations(seoScore: number, wordCount: number, keywords: any[]): Array<{
  type: string;
  title: string;
  description: string;
}> {
  const recommendations = [];
  
  if (seoScore < 70) {
    recommendations.push({
      type: "improvement",
      title: "Improve overall SEO score",
      description: "Consider adding more relevant keywords and improving content structure"
    });
  }
  
  if (wordCount < 150) {
    recommendations.push({
      type: "content",
      title: "Increase content length",
      description: "Longer content tends to perform better in search results. Aim for at least 300 words."
    });
  }
  
  if (keywords.length < 3) {
    recommendations.push({
      type: "keywords",
      title: "Add more targeted keywords",
      description: "Include more specific keywords related to your topic to improve search visibility"
    });
  }
  
  return recommendations;
}

function insertKeywordIntelligently(text: string, keyword: string): string {
  const sentences = text.split(/(\. |\! |\? )/).filter(s => s.trim().length > 0);
  let bestIndex = 0;
  let bestScore = 0;
  
  // Find the best sentence to insert the keyword
  for (let i = 0; i < sentences.length; i += 2) { // Only check actual sentences, not separators
    const sentence = sentences[i];
    if (!sentence || sentence.trim().length < 10) continue;
    
    let score = 0;
    const words = keyword.toLowerCase().split(' ');
    
    // Score based on semantic similarity
    words.forEach(word => {
      if (sentence.toLowerCase().includes(word)) {
        score += 10;
      }
    });
    
    // Prefer middle sentences
    const position = i / sentences.length;
    if (position > 0.2 && position < 0.8) {
      score += 5;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }
  
  // Insert keyword naturally into the best sentence
  if (bestIndex < sentences.length && sentences[bestIndex]) {
    const sentence = sentences[bestIndex];
    const words = sentence.split(' ');
    
    // Find a good insertion point (after articles, prepositions, etc.)
    let insertPos = Math.floor(words.length * 0.3); // About 30% into the sentence
    
    // Adjust insertion point to be after connecting words
    for (let i = insertPos; i < Math.min(insertPos + 3, words.length - 1); i++) {
      const word = words[i].toLowerCase().replace(/[^\w]/g, '');
      if (['the', 'a', 'an', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'to'].includes(word)) {
        insertPos = i + 1;
        break;
      }
    }
    
    // Insert the keyword
    words.splice(insertPos, 0, keyword);
    sentences[bestIndex] = words.join(' ');
  }
  
  return sentences.join('');
}
