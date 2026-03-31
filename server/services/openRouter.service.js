import axios from "axios"

export const askAi = async (messages) => {
    try {
        if(!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error("Messages array is empty.");
        }
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-4o-mini",
                messages: messages

            },
            {
            headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },});

        const content = response?.data?.choices?.[0]?.message?.content;

        if (!content || !content.trim()) {
      throw new Error("AI returned empty response.");
    }

    return content
    } catch (error) {
            console.error("OpenRouter Error:", error.response?.data || error.message);
    throw new Error("OpenRouter API Error");

    }
}


// explain askAi function line by line and how it is used to interact with the OpenRouter API to get a response based on the provided messages array.

// The `askAi` function is an asynchronous function that takes an array of messages as input. It is designed to interact with the OpenRouter API to get a response based on the provided messages. Here's a line-by-line explanation of the function:

// 1. The function starts with a try-catch block to handle any potential errors that may occur during the API interaction.

// 2. The first line inside the try block checks if the `messages` parameter is valid. It checks if `messages` is not null, is an array, and has at least one message. If any of these conditions are not met, it throws an error indicating that the messages array is empty.      

// 3. The function then makes a POST request to the OpenRouter API endpoint for chat completions using the `axios` library. The request body includes the model to be used (in this case, "openai/gpt-4o-mini") and the messages array that contains the conversation history or prompts for the AI.

// 4. The request also includes headers for authorization, where it uses a Bearer token that is expected to be stored in the environment variable `OPENROUTER_API_KEY`. It also specifies that the content type of the request is JSON.

// 5. After the API call, the function attempts to extract the content of the AI's response from the nested structure of the response object. It uses optional chaining to safely access the content property.

// 6. The function checks if the extracted content is valid and not empty. If the content is empty or only contains whitespace, it throws an error indicating that the AI returned an empty response.