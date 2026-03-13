import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import https from 'node:https';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

const TELEGRAM_TIMEOUT_MS = 5000;

interface ApplicationBody {
  name?: string;
  phone?: string;
  message?: string;
  files?: string[];
  fullText?: string;
}

function sendJson(res: VercelResponse | any, status: number, data: object) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(data);
}

async function sendToTelegram(text: string): Promise<{ ok: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return { ok: false, error: 'Telegram not configured' };
  }

  const payload = JSON.stringify({
    chat_id: chatId,
    text: text.slice(0, 4096),
  });

  return new Promise((resolve) => {
    const req = https.request(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        timeout: TELEGRAM_TIMEOUT_MS,
      },
      (tgRes) => {
        let body = '';
        tgRes.on('data', (chunk: Buffer) => (body += chunk.toString()));
        tgRes.on('end', () => {
          if (tgRes.statusCode === 200) {
            resolve({ ok: true });
          } else {
            resolve({ ok: false, error: body || 'Telegram API error' });
          }
        });
      }
    );

    req.on('error', (err) => resolve({ ok: false, error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, error: 'Telegram API timeout' });
    });
    req.write(payload);
    req.end();
  });
}

export async function applicationsHandler(
  req: VercelRequest | import('express').Request,
  res: VercelResponse | import('express').Response
) {
  try {
    if (req.method !== 'POST') {
      return sendJson(res, 405, {
        success: false,
        message: 'Method not allowed',
      });
    }

    const body = (req.body || {}) as ApplicationBody;
    const { name, phone, message, files, fullText } = body;

    if (!fullText && (!name || !phone)) {
      return sendJson(res, 400, {
        success: false,
        message: 'Name and phone are required',
      });
    }

    if (files && !Array.isArray(files)) {
      return sendJson(res, 400, {
        success: false,
        message: 'files must be an array of URLs',
      });
    }

    const text = fullText
      ? fullText
      : [
          'New Driver Application',
          '',
          `Name: ${name || '-'}`,
          `Phone: ${phone || '-'}`,
          `Message: ${message || '-'}`,
          '',
          'Files:',
          !files || files.length === 0 ? 'No files attached' : files.map((f) => f).join('\n'),
        ].join('\n');

    const result = await sendToTelegram(text);

    if (!result.ok) {
      console.error('Telegram failed:', result.error);
      return sendJson(res, 502, {
        success: false,
        message: result.error || 'Failed to send notification',
      });
    }

    return sendJson(res, 200, { success: true });
  } catch (err: any) {
    console.error('applicationsHandler error:', err);
    return sendJson(res, 500, {
      success: false,
      message: err?.message || 'Internal server error',
    });
  }
}

// Express app for local dev (includes blob-upload + applications)
export const app = express();
app.use(express.json());

app.post('/api/blob-upload', async (req, res) => {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return sendJson(res, 500, { error: 'BLOB_READ_WRITE_TOKEN not configured' });
    }
    const body = req.body as HandleUploadBody;
    const jsonResponse = await handleUpload({
      body,
      request: req as any,
      token: process.env.BLOB_READ_WRITE_TOKEN!,
      onBeforeGenerateToken: async () => ({
        addRandomSuffix: true,
        access: 'public',
        maximumSizeInBytes: 10 * 1024 * 1024,
      }),
      onUploadCompleted: async () => {},
    });
    return res.status(200).json(jsonResponse);
  } catch (error: any) {
    console.error('Blob handleUpload error', error);
    return sendJson(res, 400, { error: error?.message || 'Upload error' });
  }
});

app.post('/api/applications', applicationsHandler);

// Vercel: use native handler (faster, no Express overhead)
// Local: server.ts uses app
export default applicationsHandler;
