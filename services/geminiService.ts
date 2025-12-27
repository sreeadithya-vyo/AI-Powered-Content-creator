import { GoogleGenAI, Type } from "@google/genai";
import { ContentIdea, HashtagGroup, BrandVoiceAnalysis, AnalyticsInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FLASH = 'gemini-3-flash-preview';

// --- Ideas Generation ---
export const generateContentIdeas = async (
  niche: string,
  platform: string,
  goal: string,
  tone: string
): Promise<ContentIdea[]> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing");

  const prompt = `Generate 5 high-quality, viral-worthy content ideas for a ${niche} creator on ${platform}.
  Goal: ${goal}.
  Tone: ${tone}.
  Return the response in JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              hook: { type: Type.STRING },
              format: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
              description: { type: Type.STRING },
            },
            required: ['title', 'hook', 'format', 'difficulty', 'description'],
          },
        },
      },
    });
    
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Idea Error:", error);
    return [];
  }
};

// --- Caption Generation ---
export const generateCaption = async (
  topic: string,
  platform: string,
  tone: string,
  extraContext: string
): Promise<string> => {
  if (!process.env.API_KEY) return "API Key is missing. Please configure it in your settings.";

  const prompt = `Write a high-engagement caption/post for ${platform} about "${topic}".
  Tone: ${tone}.
  Additional Context: ${extraContext}.
  
  Include:
  1. A strong hook.
  2. Value-packed body.
  3. A clear Call to Action (CTA).
  4. Relevant emojis.
  
  Format the output clearly with Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
    });
    return response.text || "Failed to generate caption.";
  } catch (error: any) {
    console.error("Gemini Caption Error:", error);

    const errorMessage = error.message || '';
    const errorStatus = error.status || (error.response ? error.response.status : 0);

    if (errorMessage.includes('429') || errorStatus === 429) {
      return "API rate limit exceeded. Please try again later.";
    }
    if (errorMessage.includes('400') || errorStatus === 400) {
       return "Content generation failed due to invalid parameters.";
    }
    if (errorMessage.includes('401') || errorStatus === 401) {
       return "Invalid API Key. Please check your settings.";
    }
    if (errorMessage.includes('404') || errorStatus === 404) {
       return "The selected model is currently unavailable or invalid.";
    }
    if (errorMessage.includes('503') || errorStatus === 503) {
       return "The service is temporarily overloaded. Please try again in a moment.";
    }

    return "An unexpected error occurred. Please check the console for details.";
  }
};

// --- Hashtag Generation ---
export const generateHashtags = async (topic: string): Promise<HashtagGroup[]> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing");

  const prompt = `Generate 3 distinct groups of hashtags for the topic: "${topic}".
  Group 1: Niche specific (Low competition).
  Group 2: Viral/Trending (High competition).
  Group 3: Mixed (Balanced).
  
  Return JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              relevance: { type: Type.NUMBER },
              competition: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            },
            required: ['name', 'tags', 'relevance', 'competition'],
          },
        },
      },
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Hashtag Error:", error);
    return [];
  }
};

// --- Repurpose Content ---
export const repurposeContent = async (
  originalContent: string,
  sourceType: string,
  targetPlatforms: string[]
): Promise<Record<string, string>> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing");

  const prompt = `Repurpose the following ${sourceType} content into optimized posts for: ${targetPlatforms.join(', ')}.
  
  Original Content:
  "${originalContent.substring(0, 3000)}..."
  
  Return a JSON object where keys are the platform names and values are the generated content strings.
  Ensure formatting is appropriate for each platform (e.g., threads for Twitter, professional for LinkedIn, short & punchy for TikTok captions).`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Repurpose Error:", error);
    return {};
  }
};

// --- Brand Voice Analysis ---
export const analyzeBrandVoice = async (samples: string): Promise<BrandVoiceAnalysis | null> => {
  if (!process.env.API_KEY) return null;

  const prompt = `Analyze the following text samples to determine the brand's unique voice and tone.
  
  Samples:
  "${samples.substring(0, 3000)}..."

  Return a JSON object with:
  - descriptors: Array of 3-5 adjectives describing the tone (e.g., 'Witty', 'Professional').
  - styleGuide: A short paragraph summarizing the writing style.
  - dos: Array of 3 things to DO to sound like this brand.
  - donts: Array of 3 things NOT to do.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: {
             descriptors: { type: Type.ARRAY, items: { type: Type.STRING } },
             styleGuide: { type: Type.STRING },
             dos: { type: Type.ARRAY, items: { type: Type.STRING } },
             donts: { type: Type.ARRAY, items: { type: Type.STRING } },
           },
           required: ['descriptors', 'styleGuide', 'dos', 'donts']
        }
      },
    });
    return JSON.parse(response.text || 'null');
  } catch (error) {
    console.error("Gemini Brand Voice Error:", error);
    return null;
  }
};

// --- Analytics Insights ---
export const generateAnalyticsInsights = async (metricsJSON: any): Promise<AnalyticsInsight[]> => {
  if (!process.env.API_KEY) return [];

  const prompt = `Analyze the following social media metrics and provide 3 actionable insights/tips to improve performance.
  
  Metrics:
  ${JSON.stringify(metricsJSON)}

  Return a JSON array of objects with: 'type' (Growth, Engagement, or Trend), 'title', 'description', and 'actionableTip'.
  `;

  try {
     const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ['Growth', 'Engagement', 'Trend'] },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              actionableTip: { type: Type.STRING },
            },
            required: ['type', 'title', 'description', 'actionableTip'],
          },
        },
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Analytics Error:", error);
    return [];
  }
};