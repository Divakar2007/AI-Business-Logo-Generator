
import { GoogleGenAI, Type } from "@google/genai";
import type { UserInput, GeneratedResult, NameIdea } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const nameGenerationSchema = {
  type: Type.OBJECT,
  properties: {
    ideas: {
      type: Type.ARRAY,
      description: "An array of 4 business name ideas.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The business name.",
          },
          description: {
            type: Type.STRING,
            description: "A short, one-sentence visual description for a logo that fits this name and the user's preferences.",
          },
        },
        required: ["name", "description"],
        propertyOrdering: ["name", "description"],
      },
    },
  },
  required: ["ideas"],
};

const cleanSvgCode = (rawText: string): string => {
  const svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/);
  if (svgMatch) {
    return svgMatch[0];
  }
  // Fallback if no specific SVG block is found, clean up markdown backticks
  return rawText.replace(/```svg\n?/, "").replace(/```/, "").trim();
};


export const generateBusinessIdeas = async (userInput: UserInput): Promise<GeneratedResult[]> => {
  const { industry, preferences } = userInput;

  // Step 1: Generate Names and Logo Descriptions
  const nameGenResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate 4 creative business names for an industry: '${industry}' with these preferences: '${preferences}'. For each name, provide a short, one-sentence visual description for a logo.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: nameGenerationSchema,
    },
  });

  const nameIdeasResponse = JSON.parse(nameGenResponse.text);
  const nameIdeas: NameIdea[] = nameIdeasResponse.ideas || [];

  if (!nameIdeas || nameIdeas.length === 0) {
      throw new Error("The AI could not generate any business names. Try a different prompt.");
  }

  // Step 2: Generate PNG and SVG for each name idea sequentially to avoid rate-limiting issues.
  const results: GeneratedResult[] = [];
  for (const idea of nameIdeas) {
      const logoPrompt = `A simple, modern, vector logo for a company named '${idea.name}'. The logo must be: ${idea.description}. Minimalist, on a clean solid background, high quality, suitable for a brand.`;
      
      const svgPrompt = `Generate ONLY the raw SVG code for a simple, modern, vector logo for a business named "${idea.name}". The logo should visually represent: "${idea.description}". The SVG must be square, use a viewBox="0 0 100 100", have a transparent background (or easily removable one), and use a professional and clean color palette based on these preferences: ${preferences}. Do not include any XML declaration, comments, or any text other than the SVG code itself. Start the response directly with <svg ...> and end with </svg>.`;

      try {
        // Generate both PNG and SVG in parallel for a single idea
        const [imageResponse, svgResponse] = await Promise.all([
          ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: logoPrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
          }),
          ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: svgPrompt,
          })
        ]);

        const pngBase64 = imageResponse.generatedImages[0]?.image.imageBytes ?? '';
        const svgCode = cleanSvgCode(svgResponse.text);

        results.push({
          name: idea.name,
          description: idea.description,
          pngBase64,
          svgCode,
        });
      } catch (error) {
          console.error(`Failed to generate logo for ${idea.name}:`, error);
          // Push a result with empty image data so the UI can gracefully handle the failure for this specific card.
          results.push({
              name: idea.name,
              description: "Logo generation failed for this idea.",
              pngBase64: '',
              svgCode: '',
          });
      }
  }

  return results;
};
