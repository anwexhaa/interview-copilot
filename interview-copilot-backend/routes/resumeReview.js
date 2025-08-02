const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const natural = require('natural');
const upload = multer();
const router = express.Router();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

function extractKeywords(text) {
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(text.toLowerCase());
  const stopWords = new Set(['the', 'and', 'of', 'to', 'a', 'in', 'for', 'with', 'on', 'at', 'as', 'an', 'is']);
  return [...new Set(words.filter(word => /^[a-z]+$/.test(word) && !stopWords.has(word)))];
}

router.post('/', upload.single('resumeFile'), async (req, res) => {
  try {
    const { jobDescription, optimize } = req.body;
    if (!req.file || !jobDescription) return res.status(400).json({ error: 'Missing inputs' });

    const pdfBuffer = req.file.buffer;
    const data = await pdfParse(pdfBuffer);
    const resumeText = data.text;

    const jobKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(resumeText);

    const prompt = `
You're an advanced resume analysis AI. Here's a job description:
"${jobDescription}"

Here is the resume content:
"${resumeText}"

Here are the important keywords from the job description:
${JSON.stringify(jobKeywords)}

Give me a JSON in this format:
{
  "score": number (match between 0 to 100),
  "matchedKeywords": [...],
  "missingKeywords": [...],
  "recommendations": [
    "Replace X with Y",
    "Add a bullet point about Z"
  ]
}
`;

    const result = await model.generateContent(prompt);
    const aiText = result.response.text();
console.log('=== Gemini Response ===\n', aiText);


    // Safety check before parsing
    const jsonStart = aiText.indexOf('{');
    const jsonEnd = aiText.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === -1) {
      return res.status(500).json({ error: 'AI response was not JSON. Response was:\n' + aiText });
    }

    let parsed;
    try {
      parsed = JSON.parse(aiText.slice(jsonStart, jsonEnd));
    } catch (err) {
      return res.status(500).json({ error: 'Error parsing AI response as JSON', raw: aiText });
    }

    if (optimize === 'true') {
      return res.json({
        feedback: `You might want to add these keywords to improve your resume:\n- ${parsed.missingKeywords.join('\n- ')}`,
        recommendations: parsed.recommendations
      });
    }

    res.json({
      feedback: `Score: ${parsed.score}\n\nMatched keywords: ${parsed.matchedKeywords.join(', ')}\n\nMissing keywords: ${parsed.missingKeywords.join(', ')}`,
      recommendations: parsed.recommendations
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
