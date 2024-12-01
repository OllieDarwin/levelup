import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
    baseURL: "https://api.openai.com/v1"
})

// Generates maths question using AI for QUIZ GAME
export async function generateQuestion(studyTopics: string) {
    try {
      const prompt = `You are an educational assistant specialised in maths. Generate a question based on the following:
        The user has described themself, the course they are doing and what questions they would like to be asked: ${studyTopics}.
        The question should be of medium difficulty.

        Provide it in clear language, and ensure it is solvable without advanced techniques.

        Your response **must only** include valid JSON that adheres to this schema:
        {
          "question": "Your question here",
          "title": "A clearly defined topic or title of the question",
          "description": "A bried, concise description of the topic."
        }

        Please ensure you return a valid json schema using the template above. All the keys should be assinged to strings.

        Generate a question using all of the above information now:
      `
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 1.5,
        response_format: {
            type: 'json_schema',
            json_schema: {
                name: 'question_response',
                schema: {
                    type: 'object',
                    properties: {
                        question: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' }
                    }
                }
            }
        }
      })
  
      if (response.choices[0].message.content === null) {
        throw "No response found"
      }
      const question = JSON.parse(response.choices[0].message.content)
      if (!question) throw new Error("Failed to generate question")
  
      return question
    } catch (error) {
      console.error("Error generating question:", error)
      throw error
    }
  };

// Generates maths solution using AI for QUIZ GAME
export async function getSolution(question: string, userSolution: string) {
    try {
      const prompt = `
        Here is a GCSE Maths question: "${question}"
        A student has provided this solution: "${userSolution}"
        Determine if the student's solution is correct or incorrect, and explain why in clear and concise terms.
        I do not care about the units given or how much working is shown: if the correct answer to the question can be found anywhere in their solution then say correct = true.

        Do not try to include any formatting in your response as I cannot display it.
        Do not generate a response any longer than 50-60 words.

        You will have to respond in a JSON schema with the following keys:
        correct: determine if the user was correct or incorrect and return a corresponding boolean value
        response: here is where your clear and concise feedback should go
      `
  
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        response_format: {
            type: 'json_schema',
            json_schema: {
                name: 'question_response',
                schema: {
                    type: 'object',
                    properties: {
                        correct: { type: 'boolean' },
                        response: { type: 'string' },
                    }
                }
            }
        }
      })
  
      if (response.choices[0].message.content === null) {
        throw "No response found"
      }
      const feedback = JSON.parse(response.choices[0].message.content)
      if (!feedback) throw new Error("Failed to generate feedback")
  
      return feedback
    } catch (error) {
      console.error("Error evaluating solution:", error);
      throw error
    }
  };
  