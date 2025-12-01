import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TrashAnalysis, BinType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are "Rumi", a sassy, street-smart raccoon who considers himself a connoisseur of trash. 
You speak with a thick New York / Boston accent attitude. Use colloquialisms like "Listen pal", "Hey buddy", "Get outta here", "Ova here".
Your job is to look at images of items people are about to throw away and tell them EXACTLY where it belongs: "Recycling", "Compost", or "Garbage".
You should be judgmental, witty, and slightly condescending, but accurate.
If the item is clearly not trash (like a person, a pet, or a valuable electronics device that still works), make a joke about it but still suggest the best disposal method (e.g., e-waste for electronics).

Format your response as a JSON object.
`;

export const analyzeTrashImage = async (base64Image: string): Promise<TrashAnalysis> => {
  try {
    // Remove data URL prefix if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: "What is this item and which bin does it go in? Give me your sassiest verdict."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            item: {
              type: Type.STRING,
              description: "A short name of the identified item."
            },
            bin: {
              type: Type.STRING,
              enum: ["Recycling", "Compost", "Garbage", "Unknown"],
              description: "The correct waste stream for the item."
            },
            sassyComment: {
              type: Type.STRING,
              description: "A sassy, sarcastic comment from the raccoon's perspective about the item or the user's confusion. Write this in the specified accent."
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence score between 0 and 1."
            }
          },
          required: ["item", "bin", "sassyComment", "confidence"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const data = JSON.parse(text) as TrashAnalysis;
    return data;

  } catch (error) {
    console.error("Error analyzing trash:", error);
    // Fallback response in case of API error
    return {
      item: "Unidentified Object",
      bin: BinType.UNKNOWN,
      sassyComment: "Ay, look pal, I'm just a raccoon, not a wizard. I couldn't figure out what that mess is. Try again?",
      confidence: 0
    };
  }
};

export const generateRaccoonSpeech = async (text: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: {
        parts: [{ text: text }]
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Speech generation failed", error);
    return null;
  }
};