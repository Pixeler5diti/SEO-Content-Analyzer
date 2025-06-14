import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { analyzeSeo, insertKeyword } from "@/lib/api";
import { Search, ChartLine, BookOpen, Percent, FileText, Plus, Copy, Undo2, Download, Filter, Crown, HelpCircle, Trash2, CheckCircle, Lightbulb, Heading, Link } from "lucide-react";
import type { SeoAnalysis } from "@shared/schema";

export default function Home() {
  const [inputText, setInputText] = useState("Artificial intelligence is revolutionizing the way businesses operate in the digital age. From automating customer service to predicting market trends, AI technologies are becoming essential tools for competitive advantage. Companies that embrace machine learning and data analytics are seeing significant improvements in efficiency and customer satisfaction.");
  const [contentType, setContentType] = useState<"blog_post" | "social_media" | "newsletter" | "product_description">("blog_post");
  const [analysis, setAnalysis] = useState<SeoAnalysis | null>(null);
  const [optimizedText, setOptimizedText] = useState("");
  const [insertedKeywords, setInsertedKeywords] = useState(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const analyzeMutation = useMutation({
    mutationFn: analyzeSeo,
    onSuccess: (data) => {
      setAnalysis(data);
      setOptimizedText(data.optimizedText || data.originalText);
      setInsertedKeywords(0);
      toast({
        title: "Analysis Complete",
        description: "Your content has been analyzed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze content",
        variant: "destructive",
      });
    },
  });

  const insertMutation = useMutation({
    mutationFn: insertKeyword,
    onSuccess: (data) => {
      setOptimizedText(data.optimizedText);
      setInsertedKeywords(prev => prev + 1);
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
      toast({
        title: "Keyword Inserted",
        description: "Keyword has been successfully added to your content.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Insertion Failed",
        description: error.message || "Failed to insert keyword",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (inputText.trim().length < 10) {
      toast({
        title: "Invalid Input",
        description: "Please enter at least 10 characters of text to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    analyzeMutation.mutate({
      text: inputText,
      contentType,
    });
  };

  const handleInsertKeyword = (keyword: string) => {
    if (!analysis) return;
    
    insertMutation.mutate({
      analysisId: analysis.id,
      keyword,
      text: optimizedText,
    });
  };

  const wordCount = inputText.trim().split(/\s+/).filter(word => word.length > 0).length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-blue-100 text-blue-700";
      case "low": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "keywords": return <Lightbulb className="w-4 h-4" />;
      case "content": return <Heading className="w-4 h-4" />;
      case "improvement": return <Link className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "keywords": return "bg-amber-50 border-amber-200";
      case "content": return "bg-blue-50 border-blue-200";
      case "improvement": return "bg-green-50 border-green-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getRecommendationIconColor = (type: string) => {
    switch (type) {
      case "keywords": return "bg-amber-500 text-white";
      case "content": return "bg-blue-500 text-white";
      case "improvement": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getRecommendationTextColor = (type: string) => {
    switch (type) {
      case "keywords": return "text-amber-800";
      case "content": return "text-blue-800";
      case "improvement": return "text-green-800";
      default: return "text-gray-800";
    }
  };

  const getRecommendationDescColor = (type: string) => {
    switch (type) {
      case "keywords": return "text-amber-600";
      case "content": return "text-blue-600";
      case "improvement": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(optimizedText);
    toast({
      title: "Copied",
      description: "Optimized text has been copied to clipboard.",
    });
  };

  const resetText = () => {
    setOptimizedText(analysis?.originalText || inputText);
    setInsertedKeywords(0);
    toast({
      title: "Reset Complete",
      description: "Text has been reset to original version.",
    });
  };

  const highlightKeywords = (text: string) => {
    if (!analysis?.keywords) return text;
    
    let highlightedText = text;
    analysis.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="bg-blue-200 px-1 rounded">${keyword.text}</span>`);
    });
    
    return highlightedText;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Search className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SEO Analyzer</h1>
                <p className="text-sm text-gray-500">Optimize your content for better rankings</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                <HelpCircle className="w-5 h-5" />
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Crown className="w-4 h-4 mr-2" />
                Pro
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <div className="space-y-6">
            {/* Input Card */}
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Content Input</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FileText className="w-4 h-4" />
                    <span>{wordCount} words</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="content-input" className="block text-sm font-medium text-gray-700 mb-2">
                      Paste your blog post, newsletter, tweet, or caption
                    </label>
                    <Textarea 
                      id="content-input"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="h-48 resize-none"
                      placeholder="Enter your content here to analyze SEO potential and get keyword suggestions..."
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog_post">Blog Post</SelectItem>
                          <SelectItem value="social_media">Social Media</SelectItem>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                          <SelectItem value="product_description">Product Description</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInputText("")}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button 
                      onClick={handleAnalyze}
                      disabled={analyzeMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <ChartLine className="w-4 h-4 mr-2" />
                      {analyzeMutation.isPending ? "Analyzing..." : "Analyze SEO"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Results Card */}
            {analysis && (
              <Card className="shadow-sm border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">SEO Analysis Results</h2>
                    <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      <span>Analysis Complete</span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">SEO Score</p>
                          <p className="text-2xl font-bold text-blue-600">{analysis.seoScore}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <ChartLine className="text-blue-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Readability</p>
                          <p className="text-2xl font-bold text-green-600">{analysis.readabilityScore}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                          <BookOpen className="text-green-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Keyword Density</p>
                          <p className="text-2xl font-bold text-orange-600">{analysis.keywordDensity?.toFixed(1)}%</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <Percent className="text-orange-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Word Count</p>
                          <p className="text-2xl font-bold text-purple-600">{analysis.wordCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <FileText className="text-purple-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {analysis.recommendations && analysis.recommendations.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-800 mb-3">Optimization Opportunities</h3>
                      
                      {analysis.recommendations.map((rec, index) => (
                        <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border ${getRecommendationColor(rec.type)}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${getRecommendationIconColor(rec.type)}`}>
                            {getRecommendationIcon(rec.type)}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${getRecommendationTextColor(rec.type)}`}>{rec.title}</p>
                            <p className={`text-xs ${getRecommendationDescColor(rec.type)}`}>{rec.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Keywords and Preview Section */}
          <div className="space-y-6">
            {/* Keywords Card */}
            {analysis?.keywords && (
              <Card className="shadow-sm border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Recommended Keywords</h2>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                        <Filter className="w-4 h-4 mr-1" />
                        Filter
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {analysis.keywords.map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-600 transition-colors group">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-800">{keyword.text}</span>
                            <div className="flex items-center space-x-2">
                              <Badge className={getDifficultyColor(keyword.difficulty)}>
                                {keyword.difficulty}
                              </Badge>
                              <Badge className="bg-green-100 text-green-700">
                                {keyword.volume}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{keyword.context}</p>
                        </div>
                        <Button 
                          onClick={() => handleInsertKeyword(keyword.text)}
                          disabled={insertMutation.isPending}
                          size="sm"
                          className="ml-4 bg-blue-600 hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Insert
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preview Card */}
            {analysis && (
              <Card className="shadow-sm border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Optimized Preview</h2>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm" onClick={resetText}>
                        <Undo2 className="w-4 h-4 mr-1" />
                        Reset
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <div 
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[200px] text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: highlightKeywords(optimizedText) }}
                    />
                  </div>

                  {/* Enhanced metrics for optimized content */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-green-600">+{insertedKeywords * 6}</p>
                        <p className="text-xs text-gray-500">SEO Score Improvement</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-blue-600">{insertedKeywords}</p>
                        <p className="text-xs text-gray-500">Keywords Added</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-orange-600">+{(insertedKeywords * 0.4).toFixed(1)}%</p>
                        <p className="text-xs text-gray-500">Density Boost</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
