import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import https from 'node:https';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

const TELEGRAM_TIMEOUT_MS = 5000;

interface DocumentItem {
  label: string;
  url: string;
}

interface ApplicationBody {
  position?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  experience?: string;
  cdlType?: string;
  ssn?: string;
  documents?: DocumentItem[];
  /** @deprecated Use structured fields. Kept for backward compatibility. */
  fullText?: string;
  /** @deprecated Use documents. */
  message?: string;
  /** @deprecated Use documents. */
  files?: string[];
}

function sendJson(res: VercelResponse | any, status: number, data: object) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(data);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatDriverApplicationMessage(body: ApplicationBody): string {
  const { position, name, phone, email, address, experience, cdlType, ssn, documents } = body;

  const docs = Array.isArray(documents)
    ? documents.filter((d) => d?.label && d?.url && String(d.url).startsWith('http'))
    : [];

  const safe = (v: string | undefined) => (v ? escapeHtml(String(v)) : '-');
  const emailHtml = email ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : '-';

  const lines: string[] = [
    '🚀 New Driver Application',
    '',
    `Position: ${safe(position)}`,
    `Name: ${safe(name)}`,
    `Phone: ${safe(phone)}`,
    `Email: ${emailHtml}`,
    `Address: ${safe(address)}`,
    `Experience: ${safe(experience)}`,
    `CDL Type: ${safe(cdlType)}`,
    ssn ? `SSN / EID: ${escapeHtml(String(ssn))}` : 'SSN / EID: -',
  ];

  lines.push('');
  lines.push(`Documents: 📎 ${docs.length} file(s)`);

  if (docs.length > 0) {
    for (const d of docs) {
      lines.push(`📎 ${escapeHtml(d.label)}: ${d.url}`);
    }
  }

  return lines.join('\n');
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
    parse_mode: 'HTML',
    disable_web_page_preview: true,
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
      return sendJson(res, 405, { success: false, message: 'Method not allowed' });
    }

    const body = (req.body || {}) as ApplicationBody;
    const { fullText } = body;

    // Legacy: accept preformatted fullText
    const text = fullText
      ? fullText
      : formatDriverApplicationMessage(body);

    // Validate: need either fullText or structured fields
    if (!fullText) {
      const { name, phone } = body;
      if (!name || !phone) {
        return sendJson(res, 400, {
          success: false,
          message: 'Name and phone are required',
        });
      }
    }

    const result = await sendToTelegram(text);

    if (!result.ok) {
      console.error('Telegram failed:', result.error);
      return sendJson(res, 502, {
        success: false,
        message: result.error || 'Failed to send notification',
      });
    }

    return sendJson(res, 200, { success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('applicationsHandler error:', err);
    return sendJson(res, 500, { success: false, message });
  }
}

// Express app for local dev
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
      request: req as unknown as Request,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async () => ({
        addRandomSuffix: true,
        access: 'public',
        maximumSizeInBytes: 10 * 1024 * 1024,
      }),
      onUploadCompleted: async () => {},
    });
    return res.status(200).json(jsonResponse);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Upload error';
    console.error('Blob handleUpload error', error);
    return sendJson(res, 400, { error: msg });
  }
});

app.post('/api/applications', applicationsHandler);

export default applicationsHandler;
