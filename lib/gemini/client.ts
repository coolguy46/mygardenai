import { GoogleGenerativeAI } from '@google/generative-ai'
import { PlantIdentification } from '@/types/api';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

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
    console.log('Raw response:', text); // Debug log

    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    // Extract only the JSON part from the response
    const extractJsonFromText = (inputText: string): PlantIdentification => {
      // Try direct parsing first
      try {
        return JSON.parse(inputText) as PlantIdentification;
      } catch (e) {
        // Continue with extraction
      }

      // Remove markdown code blocks
      let processedText = inputText.replace(/```json\s*|\s*```/g, '');
      
      try {
        return JSON.parse(processedText) as PlantIdentification;
      } catch (e) {
        // Continue with more processing
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
          // Try next match
        }
      }

      throw new Error('Could not extract valid PlantIdentification JSON from response');
    };

    return extractJsonFromText(text);
  } catch (e) {
    console.error('Plant identification error:', e);
    throw new Error(e instanceof Error ? e.message : 'Failed to identify plant');
  }
}