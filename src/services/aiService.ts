import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
    baseURL: "https://api.openai.com/v1"
})

// Generates maths question using AI for QUIZ GAME
export async function generateQuestion() {
    try {
      const prompt = `
        Generate a GCSE Maths question suitable for a Grade 6 level student. 
        Provide it in clear language, and ensure it is solvable without advanced techniques.
        Example types: algebra, geometry, fractions, percentages.

        Your response **must only** include valid JSON that adheres to this schema:
        {
        "question": "string",
        "title": "string",
        "description": "string"
        }

        Do not include any text outside of this JSON object. Do not add comments, explanations, or any other information. Only output the JSON object.

        The question is the question itself.
        The title is a bried title describing the topic of the question.
        The description is a brief, concise description of the topic and a small hint on how the question may be solved.

        Generate a question now:
      `;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 1.4,
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
      });
  
      if (response.choices[0].message.content === null) {
        throw "No response found"
      }
      const question = JSON.parse(response.choices[0].message.content)
      if (!question) throw new Error("Failed to generate question");
  
      return question;
    } catch (error) {
      console.error("Error generating question:", error);
      throw error;
    }
  };

// Generates maths solution using AI for QUIZ GAME
export async function getSolution(question: string, userSolution: string) {
    try {
      const prompt = `
        Here is a GCSE Maths question: "${question}"
        A student has provided this solution: "${userSolution}"
        Determine if the student's solution is correct or incorrect, and explain why in clear and concise terms.

        You will have to respond in a JSON schema with the following keys:
        correct: determine if the user was correct or incorrect and return a corresponding boolean value
        response: here is where your clear and concise feedback should go
      `;
  
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
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
      });
  
      if (response.choices[0].message.content === null) {
        throw "No response found"
      }
      const feedback = JSON.parse(response.choices[0].message.content)
      if (!feedback) throw new Error("Failed to generate feedback");
  
      return feedback;
    } catch (error) {
      console.error("Error evaluating solution:", error);
      throw error;
    }
  };
  