/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { generateTutorSystemInstruction, TutorContext, MODEL } from './src/data/tutorPrompt.ts';
import { DECISIONS } from './src/data/story.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

app.post('/api/tutor/chat', async (req, res) => {
  try {
    const { message, history, context }: { message: string; history?: ChatMessage[]; context: TutorContext } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const systemInstruction = generateTutorSystemInstruction(context);

    if (process.env.GEMINI_API_KEY) {
      // Build conversation contents for Gemini ensuring valid role sequencing
      const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (history && Array.isArray(history) && history.length > 0) {
        for (const msg of history) {
          if (!msg.text) continue;
          if (formattedContents.length === 0 && msg.role === 'model') {
            // Gemini API requires the first turn in contents to be 'user'
            formattedContents.push({
              role: 'user',
              parts: [{ text: 'Merhaba, bu kriz anında nasıl düşünmeliyim?' }],
            });
          }
          formattedContents.push({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text }],
          });
        }
      }

      // Append current user message
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const generatePromise = ai.models.generateContent({
        model: MODEL,
        contents: formattedContents,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          maxOutputTokens: 300,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI Tutor timeout')), 20000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const reply = response.text?.trim() || DECISIONS[context.decisionId]?.tutorDefaultQuestion || 'Sistem mimarisini değerlendirirken en kritik önceliğin ne olduğunu düşünüyorsun?';
      res.json({ reply, source: 'model' });
      return;
    } else {
      // Offline / fallback response using story.ts directly without extra phrases
      console.warn('Tutor falling back: GEMINI_API_KEY is missing.');
      const defaultReply = DECISIONS[context.decisionId]?.tutorDefaultQuestion || 'Geri dönmeden önce veritabanı şemasının değişip değişmediğini nasıl anlarsın?';
      res.json({ reply: defaultReply, source: 'fallback' });
      return;
    }
  } catch (error: any) {
    console.error('Tutor falling back to default question. Reason:', error?.message || error);
    const decisionId = req.body?.context?.decisionId || 1;
    const defaultReply = DECISIONS[decisionId]?.tutorDefaultQuestion || 'Geri dönmeden önce veritabanı şemasının değişip değişmediğini nasıl anlarsın?';
    res.json({ reply: defaultReply, source: 'fallback' });
  }
});

// Setup Vite in development or serve static in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
