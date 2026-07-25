import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI client
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  };

  // AI Search & Recommendation Endpoint
  app.post('/api/ai-search', async (req, res) => {
    try {
      const { query, menuItems, history } = req.body;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query string is required' });
      }

      const ai = getAiClient();

      const systemInstruction = `
You are the expert AI Culinary Assistant & Item Search Guide for "Madhuram Sweets & Restaurant".
Your goal is to help customers search and discover food, sweets, snacks, beverages, and combos from our store catalog based on taste, price budget, dietary requirements (e.g. veg, sugar-free, spicy, sweet, mild), occasion, or group size.

Guidelines:
1. Respond politely, warmly, and concisely in Hindi / English / Hinglish depending on user preference.
2. Match user preferences strictly against the provided catalog of menu items.
3. Suggest specific items from the catalog whenever applicable.
4. You MUST respond in strict, valid JSON format matching this structure:
{
  "reply": "Conversational, helpful response summarizing recommendations and advice...",
  "suggestedItemIds": ["sheet-1-item-id", "sheet-2-item-id"],
  "quickFollowups": ["Show sugar-free options", "Spicy snacks under ₹200", "Top rated sweets"]
}
5. Only return item IDs that actually exist in the provided Store Items Catalog array.
      `;

      if (!ai) {
        // Smart fallback search if API key is not set or waiting
        const lowerQ = query.toLowerCase();
        const matches = (menuItems || []).filter((item: any) => 
          item.name.toLowerCase().includes(lowerQ) ||
          item.category.toLowerCase().includes(lowerQ) ||
          item.description.toLowerCase().includes(lowerQ)
        ).slice(0, 6);

        return res.json({
          reply: matches.length > 0
            ? `I found ${matches.length} item(s) in our store matching "${query}":`
            : `I couldn't find an exact match for "${query}", but here are some popular items you might enjoy:`,
          suggestedItemIds: matches.length > 0 
            ? matches.map((m: any) => m.id)
            : (menuItems || []).slice(0, 4).map((m: any) => m.id),
          quickFollowups: ["Sugar-free sweets", "Popular snacks", "Budget items under ₹200"]
        });
      }

      // Condensed catalog for Gemini context
      const condensedCatalog = (menuItems || []).slice(0, 300).map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        type: item.type,
        isVeg: item.isVeg,
        isSugarFree: item.isSugarFree || false,
        desc: item.description
      }));

      const promptText = `
User Query: "${query}"

Conversation History: ${JSON.stringify(history || [])}

Store Items Catalog:
${JSON.stringify(condensedCatalog)}

Analyze the query, find the best matching items from the catalog, and generate the JSON response.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch (e) {
        return res.json({
          reply: responseText,
          suggestedItemIds: [],
          quickFollowups: ["Popular sweets", "Best sellers in restaurant"]
        });
      }
    } catch (error: any) {
      console.error('AI Search Error:', error);
      res.status(500).json({ error: 'Failed to process AI search request' });
    }
  });

  // Serve Vite in development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
