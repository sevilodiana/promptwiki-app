import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const POST = async (req) => {
  try {
   // req="hello";
    /* const reqBody = JSON.parse(req.body);
    const userPrompt = reqBody['prompt'] || ''; */
    const response = await openai.createCompletion({ 
      //prompt: "What is 2 plus 2",
      prompt: req,
      model: 'text-davinci-003',
      temperature: 0,
      max_tokens: 100,
      n: 1,
  });

  
      return new Response(JSON.stringify(response.data.choices[0].text.replace(/^\n+/, '')), { status: 200 })
  } catch (error) {
      return new Response("Failed to run api", { status: 500 })
  }
} 

function generatePrompt(prompt) {
  return prompt
}