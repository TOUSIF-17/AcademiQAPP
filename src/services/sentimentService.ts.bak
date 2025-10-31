import natural from 'natural';

interface SentimentScore {
  positive: number;
  negative: number;
  neutral: number;
  compound: number;
}

class SentimentService {
  private analyzer = new natural.SentimentAnalyzer('English', 
    natural.PorterStemmer, 'afinn');

  async analyzeSentiment(text: string): Promise<SentimentScore> {
    try {
      return this.analyzeWithNatural(text);
    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      return this.analyzeWithNatural(text);
    }
  }

  private analyzeWithNatural(text: string): SentimentScore {
    try {
      const tokens = natural.WordTokenizer.tokenize(text.toLowerCase()) || [];
      const score = this.analyzer.getSentiment(tokens);
      
      let positive = 0, negative = 0, neutral = 0;
      
      if (score > 0.1) {
        positive = Math.min(score, 1);
        neutral = 1 - positive;
      } else if (score < -0.1) {
        negative = Math.min(Math.abs(score), 1);
        neutral = 1 - negative;
      } else {
        neutral = 1;
      }

      return {
        positive,
        negative,
        neutral,
        compound: score
      };
    } catch (error) {
      console.error('Error in natural sentiment analysis:', error);
      return {
        positive: 0.33,
        negative: 0.33,
        neutral: 0.34,
        compound: 0
      };
    }
  }

  getSentimentLabel(sentiment: SentimentScore): string {
    if (sentiment.compound >= 0.05) return 'Positive';
    if (sentiment.compound <= -0.05) return 'Negative';
    return 'Neutral';
  }

  getSentimentColor(sentiment: SentimentScore): string {
    if (sentiment.compound >= 0.05) return 'text-green-600';
    if (sentiment.compound <= -0.05) return 'text-red-600';
    return 'text-gray-600';
  }
}

const sentimentService = new SentimentService();
export default sentimentService;