// app.post("/api/ai/insights", async (req, res) => {
//   try {
//     const data = req.body.data;

//     const prompt = `
// You are a business analyst AI.

// Analyze this dataset and give:
// 1. Key insights
// 2. Trends
// 3. Problems
// 4. Suggestions

// DATA:
// ${JSON.stringify(data?.slice(0, 30))}
// `;

//     const response = await ai.models.generateContent({
//       model: "gemini-1.5-flash",
//       contents: prompt
//     });

//     const text = response.text;

//     res.json({ insights: text });

//   } catch (err) {
//     console.log("Gemini error:", err.message);

//     res.json({
//       insights:
//         "📊 Business stable hai\n📈 Revenue improving\n⚠ Cost control karo\n🚀 Best products pe focus karo"
//     });
//   }
// });