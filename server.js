import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
// Serve the frontend UI
app.use(express.static('public'));

// Setup Gemini API Client (Ensure GEMINI_API_KEY is in .env file)
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

app.post('/analyze', async (req, res) => {
    try {
        if (!genAI) {
            return res.status(500).json({ error: "Missing Google Gemini API Key on server." });
        }

        const { food, goal } = req.body;
        if (!food || !goal) {
            return res.status(400).json({ error: "Both food and goal are required fields." });
        }

        // Initialize desired model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        // Strict Prompt instructing AI to ALWAYS return parseable JSON
        const prompt = `You are a nutrition analyst. Analyze the following food item: "${food}" based on the primary user health goal: "${goal}".
Respond ONLY with a valid JSON object. Do not format as markdown. The JSON must exactly contain these keys:
{
  "health": "Healthy" or "Moderate" or "Unhealthy",
  "calories": "Estimated typical calories (e.g., '~350 kcal')",
  "tips": "Short, precise 1-2 sentence nutritional tip directly aligned with the goal.",
  "suggestion": "A specific, actionable healthier alternative food recommendation."
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Remove potential markdown code blocks to safely parse JSON
        const cleanJSON = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(cleanJSON);
        
        res.json(data);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ error: "Failed to generate AI analysis. See server logs." });
    }
});

app.listen(port, () => {
    console.log(`Server successfully started on port ${port}`);
});
