import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Search, TrendingUp, BookOpen, Target, Copy, RotateCcw } from "lucide-react";

export default function SeoAnalyzer() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setAnalysis({
        seoScore: 78,
        readabilityScore: 85,
        keywordDensity: 2.4,
        wordCount: text.split(' ').length,
        keywords: [
          { text: "artificial intelligence", difficulty: "Medium", volume: "12K" },
          { text: "machine learning", difficulty: "High", volume: "8.5K" },
          { text: "digital transformation", difficulty: "Low", volume: "15K" },
        ],
        suggestions: [
          "Add more long-tail keywords",
          "Improve content structure",
          "Increase content length"
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO Content Analyzer</h1>
          <p className="text-gray-600">Optimize your content for better search rankings</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Content Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your blog post, article, or any content here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px]"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {text.split(' ').filter(word => word.trim().length > 0).length} words
                  </span>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={!text.trim() || isAnalyzing}
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Content"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    SEO Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analysis.seoScore}</div>
                      <div className="text-sm text-gray-600">SEO Score</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{analysis.readabilityScore}</div>
                      <div className="text-sm text-gray-600">Readability</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Optimization Suggestions</h4>
                    {analysis.suggestions.map((suggestion: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Keywords Section */}
          <div className="space-y-6">
            {analysis && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Recommended Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.keywords.map((keyword: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{keyword.text}</div>
                          <div className="text-sm text-gray-500">Volume: {keyword.volume}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={keyword.difficulty === 'High' ? 'destructive' : keyword.difficulty === 'Medium' ? 'default' : 'secondary'}>
                            {keyword.difficulty}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Insert
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Optimized Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gray-50 rounded-lg text-sm leading-relaxed">
                      {text}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
