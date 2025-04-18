"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

export async function detectCyberbullying(text: string) {
  try {
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

    // Access the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Prompt engineering for cyberbullying detection
    const prompt = `
      Analyze the following text for cyberbullying content. 
      Cyberbullying includes harassment, threats, hate speech, insults, or any content intended to harm someone emotionally.
      
      Text to analyze: "${text}"
      
      Respond with a JSON object containing:
      1. "isCyberbullying": a boolean indicating if cyberbullying was detected
      2. "explanation": a brief explanation of why the text is or is not considered cyberbullying
      3. "confidence": a number between 0 and 1 indicating the confidence level of this assessment
      
      Only respond with the JSON object, no additional text.
    `

    // Generate content
    const result = await model.generateContent(prompt)
    const response = result.response
    const textResponse = response.text()

    // Parse the JSON response
    // Extract JSON from the response if it's wrapped in code blocks or other text
    const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/) || textResponse.match(/{[\s\S]*}/)

    const jsonString = jsonMatch ? jsonMatch[0].replace(/```json|```/g, "") : textResponse

    try {
      const parsedResponse = JSON.parse(jsonString)
      return {
        isCyberbullying: parsedResponse.isCyberbullying,
        explanation: parsedResponse.explanation,
        confidence: parsedResponse.confidence,
      }
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError)

      // Fallback: attempt to extract information from text response
      return {
        isCyberbullying: textResponse.toLowerCase().includes("yes") || textResponse.toLowerCase().includes("true"),
        explanation: "Unable to parse detailed explanation from AI response.",
        confidence: 0.5, // Default confidence when parsing fails
      }
    }
  } catch (error) {
    console.error("Error in cyberbullying detection:", error)
    throw new Error("Failed to analyze text for cyberbullying")
  }
}
