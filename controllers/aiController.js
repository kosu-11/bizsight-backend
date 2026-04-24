// import OpenAI from "openai";

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// export const getAIInsights = async (req, res) => {
//   try {
//     const data = req.body.data;

//     if (!data || data.length === 0) {
//       return res.status(400).json({ msg: "No data provided" });
//     }

//     const prompt = `
// You are a business analyst AI.

// Analyze this dataset and provide:
// 1. Key insights
// 2. Trends
// 3. Problems
// 4. Business suggestions

// DATA:
// ${JSON.stringify(data.slice(0, 50))}
// `;

//     const response = await client.chat.completions.create({
//       model: "gpt-4.1-mini",
//       messages: [{ role: "user", content: prompt }]
//     });

//     res.json({
//       insights: response.choices[0].message.content
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json("AI error");
//   }
// };