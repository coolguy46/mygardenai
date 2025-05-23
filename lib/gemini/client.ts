import { GoogleGenerativeAI } from '@google/generative-ai'
import { PlantIdentification } from '@/types/api';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!);

export async function identifyPlant(imageBase64: string): Promise<PlantIdentification> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Analyze this plant image and return a JSON object. Format your response EXACTLY like this example, replacing the placeholder text. DO NOT USE BULLET POINTS OR SPECIAL CHARACTERS in the careInstructions field:
{
  "name": "Monstera deliciosa (Swiss Cheese Plant)",
  "summary": "Popular tropical houseplant with unique split leaves",
  "description": "Large climbing plant with distinctive perforated leaves",
  "careInstructions": "Water: Once a week when top soil is dry. Light: Bright indirect light. Soil: Well-draining potting mix. Temperature: 65-85°F (18-29°C). Humidity: High humidity preferred."
}`;

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }
    ]);

    const text = result.response.text();
    if (!text) {
      throw new Error('No response from Gemini API');
    }

    const processedText = text.replace(/\r\n/g, '\n');

    // Extract only the JSON part from the response
    const extractJsonFromText = (inputText: string): PlantIdentification => {
      // Try direct parsing first
      try {
        return JSON.parse(inputText) as PlantIdentification;
      } catch (e) {
        console.log('Failed to parse JSON:', e);
      }

      // Remove markdown code blocks
      const processedText = inputText.replace(/```json\s*|\s*```/g, '');
      
      try {
        return JSON.parse(processedText) as PlantIdentification;
      } catch (e) {
        console.log('Failed to parse JSON:', e);
      }
      
      // Find JSON-like content with regex
      const jsonPattern = /\{[\s\S]*?\}/g;
      const jsonMatches = processedText.match(jsonPattern);
      
      if (!jsonMatches || jsonMatches.length === 0) {
        throw new Error('No JSON-like content found in response');
      }
      
      // Sort matches by length (descending) to try the largest/most complete JSON first
      const sortedMatches = [...jsonMatches].sort((a, b) => b.length - a.length);
      
      for (const match of sortedMatches) {
        try {
          // Fix multiline issues by replacing actual newlines with spaces
          const cleanedJson = match.replace(/\r?\n/g, ' ');
          const parsed = JSON.parse(cleanedJson) as PlantIdentification;
          
          // Validate required fields
          if (
            typeof parsed.name === 'string' &&
            typeof parsed.summary === 'string' &&
            typeof parsed.description === 'string' &&
            typeof parsed.careInstructions === 'string'
          ) {
            return parsed;
          }
        } catch (e) {
          console.log('Failed to parse JSON:', e);
        }
      }

      throw new Error('Could not extract valid PlantIdentification JSON from response');
    };

    return extractJsonFromText(processedText);
  } catch (error: unknown) {
    console.error('Plant identification error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to identify plant');
  }
}