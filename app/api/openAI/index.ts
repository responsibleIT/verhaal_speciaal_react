import OpenAI from "openai";
import { ChatCompletion, ImageGenerateParams } from "openai/resources";
import dotenv from 'dotenv'; 

dotenv.config();

const OPEN_AI_API = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
    dangerouslyAllowBrowser: true,
})

export async function askGPT(
    prompt: string,
    role?: string
  ): Promise<ChatCompletion> {

  
    return await OPEN_AI_API.chat.completions
      .create({
        messages: [
          { role: 'system', content: role ?? 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
        model: 'gpt-4',
      })
      .then((chatCompletion) => {
        return chatCompletion;
      })
      .catch((error) => {
        console.log('OPEN_AI_ERROR:', error);
        throw error;
      });
  }
// OpenAI API - DALL·E
export async function askDALLE(prompt: string): Promise<string> {

  let imageParams: ImageGenerateParams = {
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1024x1024',
  };

  let response = await OPEN_AI_API.images.generate(imageParams);

  let imageUrl = response.data[0].url;
  let errorImage =
    'https://www.globalsign.com/application/files/9516/0389/3750/What_Is_an_SSL_Common_Name_Mismatch_Error_-_Blog_Image.jpg';

  return imageUrl || errorImage;


}