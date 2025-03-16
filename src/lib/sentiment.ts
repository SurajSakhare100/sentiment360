import vader from 'vader-sentiment';

export interface SentimentScore {
  compound: number;
  pos: number;
  neu: number;
  neg: number;
}

export interface SentimentResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: SentimentScore;
}

export function analyzeSentiment(text: string): SentimentResult {
  const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(text);
  
  let sentiment: 'positive' | 'negative' | 'neutral';
  if (intensity.compound >= 0.05) {
    sentiment = 'positive';
  } else if (intensity.compound <= -0.05) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }

  return {
    text,
    sentiment,
    score: {
      compound: intensity.compound,
      pos: intensity.pos,
      neu: intensity.neu,
      neg: intensity.neg
    }
  };
} 