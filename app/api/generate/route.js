import {Configuration, OpenAIApi} from "openai";
import { pipeline } from "node:stream/promises";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const POST = async (req, res) => {
  try {
    
    const {prompt} = await req.json();
    const response = await openai.createCompletion({ 
      //prompt: "What is 2 plus 2",
      prompt: prompt,
      model: 'text-davinci-003',
      temperature: 0.6,
      max_tokens: 100,
      n: 1,
  });
      console.log(JSON.stringify(response.data.choices[0].text.replace(/^\n+/, '').toString()));
      return new Response(JSON.stringify(response.data.choices[0].text.replace(/^\n+/, '').toString()), { status: 200 }) 
  } catch (error) {
      return new Response("Failed to run api because you are a piece of shit", { status: 500 })
  }
} 
