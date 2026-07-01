/**
 * useRotatingContent Hook
 * Manages rotating content (greeting messages, insights, quotes).
 */

import { useState, useEffect } from 'react';
import { getGreeting } from '../../../src/utils/helpers';
import { getGreetingMessage, getInsight, getQuote } from '../services/rotatingContentService';

interface GreetingData {
  greeting: string;
  message: string;
}

export function useGreetingData(): GreetingData {
  const [data, setData] = useState<GreetingData>({
    greeting: getGreeting(),
    message: getGreetingMessage(),
  });

  useEffect(() => {
    setData({
      greeting: getGreeting(),
      message: getGreetingMessage(),
    });
  }, []);

  return data;
}

export function useInsight(): string {
  const [insight, setInsight] = useState(getInsight());

  useEffect(() => {
    setInsight(getInsight());
  }, []);

  return insight;
}

export function useQuote(): string {
  const [quote, setQuote] = useState(getQuote());

  useEffect(() => {
    setQuote(getQuote());
  }, []);

  return quote;
}
