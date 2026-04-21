import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

app.post('/analyze', async (req, res) => {
    try {
        if (!genAI) {
            return res.status(500).json({ error: "Missing Google Gemini API Key." });
        }

        const { food, goal, height, weight, bmi } = req.body;
        if (!food || !goal) {
            return res.status(400).json({ error: "Food and goal are required." });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        // Exact Prompt Template Mapped to JSON strictly!
        const prompt = `You are an advanced AI Smart Food Health Assistant.
Your job is to analyze any food input and generate personalized health insights based on user data.

USER DATA:
- Height: ${height} cm
- Weight: ${weight} kg
- BMI: ${bmi}
- Health Goal: ${goal} 

FOOD INPUT:
${food}

TASKS:
1. Identify the food correctly (handle spelling mistakes or variations).
2. Estimate calories for a typical serving size.
3. Provide macronutrient breakdown:
   - Protein (g)
   - Carbohydrates (g)
   - Fats (g)
4. Assign a health score: Healthy / Moderate / Unhealthy
5. Explain briefly why (nutrition quality, oil, sugar, protein, etc.).
6. Give personalized advice based on BMI category and user goal.
7. Suggest a healthier alternative (realistic and similar food).
8. Recommend portion size.
9. Generate 1-day sample diet plan aligned with user's goal.
10. Keep response concise but structured.

OUTPUT FORMAT (STRICT JSON ONLY WITHOUT MARKDOWN BACKTICKS):
{
  "food_name": "",
  "estimated_calories": "",
  "macronutrients": {
    "protein": "",
    "carbs": "",
    "fats": ""
  },
  "health_score": "",
  "reason": "",
  "personalized_advice": "",
  "portion_recommendation": "",
  "healthier_alternative": "",
  "one_day_diet_plan": {
    "breakfast": "",
    "lunch": "",
    "dinner": "",
    "snacks": ""
  }
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Strip markdown backticks
        const cleanJSON = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const data = JSON.parse(cleanJSON);
        
        res.json(data);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ error: "Failed to generate AI analysis." });
    }
});

app.listen(port, () => {
    console.log(`Server successfully started on port ${port}`);
});
