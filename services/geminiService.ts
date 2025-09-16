import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash-image-preview';

/**
 * Removes the background from an image using the Gemini API.
 * @param base64ImageData The base64 encoded image data (without the data:image/... prefix).
 * @param mimeType The MIME type of the image (e.g., 'image/jpeg').
 * @param prompt The text prompt describing the desired background.
 * @returns A promise that resolves to the base64 string of the processed image.
 */
export const removeBackground = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // The API should return parts. We need to find the image part.
    if (response.candidates && response.candidates[0] && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
    }

    // If no image part is found, something went wrong.
    console.error("Gemini API response did not contain an image part.", response);
    throw new Error("AI did not return an image. It might have refused the request.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Rethrow a more user-friendly error
    if (error instanceof Error && error.message.includes('429')) {
      throw new Error("Quá nhiều yêu cầu. Vui lòng thử lại sau.");
    }
    throw new Error("Đã xảy ra lỗi khi giao tiếp với dịch vụ AI.");
  }
};

/**
 * Upscales an image to a higher resolution using the Gemini API.
 * @param base64ImageData The base64 encoded image data.
 * @param mimeType The MIME type of the image.
 * @returns A promise that resolves to the base64 string of the upscaled image.
 */
export const upscaleImage = async (
  base64ImageData: string,
  mimeType: string,
): Promise<string | null> => {
  const prompt = "Upscale this image to high resolution (approx 2K). Enhance details, clarity, and sharpness of the subject. Maintain the original composition and content, only improving quality and resolution. Ensure the output is a high-quality photograph.";
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (response.candidates && response.candidates[0] && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
    }

    console.error("Gemini API response did not contain an image part for upscaling.", response);
    throw new Error("AI did not return an image for upscaling. It might have refused the request.");

  } catch (error) {
    console.error("Error calling Gemini API for upscaling:", error);
    if (error instanceof Error && error.message.includes('429')) {
      throw new Error("Quá nhiều yêu cầu. Vui lòng thử lại sau.");
    }
    throw new Error("Đã xảy ra lỗi khi giao tiếp với dịch vụ AI để nâng cấp ảnh.");
  }
};
