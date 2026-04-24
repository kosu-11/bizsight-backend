import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import multer from "multer";
import XLSX from "xlsx";
import fs from "fs";

const app = express();

/* 🔥 ADD 1: Render PORT */
const PORT = process.env.PORT || 8000;

/* 🔥 ADD 2: uploads folder auto create */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

/* ================= TEST ================= */

app.get("/", (req, res) => {
  res.send("BizSight AI Backend Running 🚀");
});

/* ================= EXCEL UPLOAD ================= */

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    fs.unlinkSync(req.file.path);

    res.json({
      message: "Excel processed successfully ✅",
      rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Excel processing failed" });
  }
});

/* ================= 🤖 AI (GENERIC + SMART) ================= */

app.post("/api/ai/insights", async (req, res) => {
  try {
    const data = req.body.data;

    if (!data || data.length === 0) {
      return res.json({ insights: "⚠ No data available" });
    }

    const prompt = `
You are a smart data analyst AI.

The dataset structure is UNKNOWN.

Your job:
1. Identify column types (numeric, text)
2. Detect what kind of data it is (sales, marks, etc.)
3. Give:
   - 3 Key Insights
   - 2 Trends
   - 2 Problems (if any)
   - 3 Recommendations

Rules:
- Keep it simple
- Use bullet points
- No assumptions beyond data

DATA:
${JSON.stringify(data.slice(0, 30))}
`;

    let aiText = null;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }]
        })
      });

      const result = await response.json();

      console.log("AI RAW:", result);

      aiText = result?.choices?.[0]?.message?.content;

    } catch (err) {
      console.log("AI error:", err.message);
    }

    if (aiText) {
      return res.json({ insights: aiText });
    }

    /* 🔥 FALLBACK */

    try {
      const sample = data[0];
      const keys = Object.keys(sample);

      const numericCols = keys.filter(k =>
        !isNaN(sample[k]) && sample[k] !== ""
      );

      let fallbackText = "📊 Basic Dataset Analysis\n\n";

      if (numericCols.length > 0) {
        numericCols.forEach(col => {
          const total = data.reduce((s, r) => s + Number(r[col] || 0), 0);
          const avg = total / data.length;

          fallbackText += `• ${col}: Total = ${total}, Avg = ${avg.toFixed(2)}\n`;
        });

        fallbackText += "\n📈 Numeric trends detected\n";
      } else {
        fallbackText += "• No numeric data found\n";
      }

      fallbackText += "🚀 Data looks consistent. Explore patterns further.";

      return res.json({ insights: fallbackText });

    } catch {
      return res.json({
        insights: "⚠ AI failed, but system is stable"
      });
    }

  } catch (err) {
    console.error(err);
    res.json({ insights: "⚠ Server error" });
  }
});

/* ================= SERVER ================= */

/* 🔥 CHANGE ONLY THIS LINE */
app.listen(PORT, () => {
  console.log("Server running on port " + PORT + " 🔥");
});