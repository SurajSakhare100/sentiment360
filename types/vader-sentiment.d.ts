declare module 'vader-sentiment' {
  interface VaderSentimentAnalysis {
    pos: number;
    neg: number;
    neu: number;
    compound: number;
  }

  interface VaderSentiment {
    SentimentIntensityAnalyzer: {
      polarity_scores(text: string): VaderSentimentAnalysis;
    };
  }

  const vader: VaderSentiment;
  export default vader;
} 