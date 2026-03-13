import type { Request, Response } from 'express';
import express from 'express';
import serverless from 'serverless-http';
import https from 'node:https';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export const app = express();

app.use(express.json());

// Blob upload handler (for local dev; Vercel uses api/blob-upload.ts)
app.post('/api/blob-upload', async (req: Request, res: Response) => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN is not configured' });
  }
  const body = req.body as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request: req as any,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async () => ({
        addRandomSuffix: true,
        access: 'public',
        maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
      }),
      onUploadCompleted: async () => {},
    });
    return res.status(200).json(jsonResponse);
  } catch (error: any) {
    console.error('Blob handleUpload error', error);
    return res.status(400).json({ error: error?.message || 'Upload error' });
  }
});

interface ApplicationBody {
  name: string;
  phone: string;
  message?: string;
  files?: string[];
  fullText?: string;
}

app.post('/api/applications', async (req: Request, res: Response) => {
  const { name, phone, message, files, fullText } = req.body as ApplicationBody;

  if (!fullText && (!name || !phone)) {
    return res.status(400).json({ success: false, message: 'Name and phone are required' });
  }

  if (files && !Array.isArray(files)) {
    return res.status(400).json({ success: false, message: '`files` must be an array of URLs' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ success: false, message: 'Telegram environment variables are not configured' });
  }

  const text = fullText
    ? fullText
    : `New Application Received\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Message: ${message || '-'}\n\n` +
      `Files:\n${!files || files.length === 0 ? 'No files attached.' : files.join('\n')}`;

  const payload = JSON.stringify({
    chat_id: chatId,
    text: text.slice(0, 4096),
  });

  try {
    const result = await new Promise<{ ok: boolean; body: string }>((resolve, reject) => {
      const req = https.request(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
          timeout: 15000,
        },
        (tgRes) => {
          let body = '';
          tgRes.on('data', (chunk) => (body += chunk));
          tgRes.on('end', () => resolve({ ok: tgRes.statusCode === 200, body }));
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Telegram API timeout'));
      });
      req.write(payload);
      req.end();
    });

    if (!result.ok) {
      console.error('Telegram error:', result.body);
      return res.status(502).json({ success: false, message: 'Failed to send Telegram message' });
    }

    return res.json({ success: true });
  } catch (err: any) {
    console.error('Telegram request failed', err);
    return res.status(504).json({
      success: false,
      message: err?.message || 'Telegram API timeout. Please try again.',
    });
  }
});

// Export serverless handler for Vercel
export default serverless(app);

