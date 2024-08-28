import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai-edge";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function GET(req: Request) {
    try {
        // Extract the `messages` from the body of the request
        // const messages = await req.json();
        const messages: ChatCompletionRequestMessage[] = [
            {
                role: "user",
                content: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '|'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
            }
        ];

        // Ask OpenAI for a streaming chat completion given the prompt
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: 200,
            stream: true,
            messages,
        });

        // Convert the response into a friendly text-stream
        const stream = OpenAIStream(response);
        // Respond with the stream
        return new StreamingTextResponse(stream);
    } catch (error) {
        console.log(error);
    }
}
