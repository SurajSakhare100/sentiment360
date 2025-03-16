import vader from 'vader-sentiment';

export interface SentimentScore {
  compound: number;
  pos: number;
  neg: number;
  neu: number;
}

export function analyzeSentiment(text: string): SentimentScore {
  return vader.SentimentIntensityAnalyzer.polarity_scores(text);
} 