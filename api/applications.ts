import express from 'express';
import https from 'node:https';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

const TELEGRAM_TIMEOUT_MS = 5000;

interface DocumentItem {
  label: string;
  url: string;
}

interface ApplicationBody {
  flow?: 'apply_step1' | 'apply_step2' | 'apply_step2_skipped';
  leadId?: string;
  sourceUrl?: string;
  submittedAt?: string;
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
  cdlClass?: string;
  driverType?: string;
  yearsExperience?: string;
  state?: string;
  sapProgram?: string;
  duiDwi?: string;
  comments?: string;
}

interface QuoteBody {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  from?: string;
  to?: string;
  cargo?: string;
}

interface ContactBody {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
}

function sendJson(res: import('express').Response | any, status: number, data: object) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(data);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getJsonBody<T extends object>(req: any): T {
  const b = req?.body;
  if (!b) return {} as T;
  if (typeof b === 'string') {
    try {
      return JSON.parse(b) as T;
    } catch {
      return {} as T;
    }
  }
  if (Buffer.isBuffer(b)) {
    try {
      return JSON.parse(b.toString('utf8')) as T;
    } catch {
      return {} as T;
    }
  }
  return b as T;
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

function formatApplyFlowMessage(body: ApplicationBody): string {
  const safe = (v: string | undefined) => (v ? escapeHtml(String(v)) : '-');
  const flow = body.flow || 'apply_step1';
  const headline =
    flow === 'apply_step1'
      ? '📝 New Apply Form'
      : flow === 'apply_step2'
        ? '📝 Apply Form — Step 2 Completed'
        : '📝 Apply Form — Step 2 Skipped';

  const lines: string[] = [
    headline,
    '',
    `Lead ID: ${safe(body.leadId)}`,
    `Source URL: ${safe(body.sourceUrl)}`,
    `Submitted At: ${safe(body.submittedAt)}`,
  ];

  if (flow === 'apply_step1') {
    const emailTrim = body.email ? String(body.email).trim() : '';
    const emailLine = emailTrim
      ? `<a href="mailto:${escapeHtml(emailTrim)}">${escapeHtml(emailTrim)}</a>`
      : '-';
    lines.push('');
    lines.push(`Name: ${safe(body.name)}`);
    lines.push(`Phone: ${safe(body.phone)}`);
    lines.push(`Email: ${emailLine}`);
    lines.push(`Driver Type: ${safe(body.driverType)}`);
    if (body.comments && String(body.comments).trim()) {
      lines.push(`Message: ${safe(body.comments)}`);
    }
  }

  if (flow === 'apply_step2') {
    lines.push('');
    lines.push(`Years of Experience: ${safe(body.yearsExperience)}`);
    lines.push(`State: ${safe(body.state)}`);
    lines.push(`SAP Program: ${safe(body.sapProgram)}`);
    lines.push(`DUI or DWI (last 3 years): ${safe(body.duiDwi)}`);
    lines.push(`Comments: ${safe(body.comments)}`);
  }

  return lines.join('\n');
}

function formatQuoteMessage(body: QuoteBody): string {
  const { name, email, phone, company, from, to, cargo } = body;
  const safe = (v: string | undefined) => (v ? escapeHtml(String(v)) : '-');
  const emailHtml = email ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : '-';

  const lines: string[] = [
    '🧾 New Quote Request',
    '',
    `Name: ${safe(name)}`,
    `Email: ${emailHtml}`,
    `Phone: ${safe(phone)}`,
    `Company: ${safe(company)}`,
    '',
    `From: ${safe(from)}`,
    `To: ${safe(to)}`,
    '',
    `Cargo details: ${safe(cargo)}`,
  ];

  return lines.join('\n');
}

function formatContactMessage(body: ContactBody): string {
  const { name, email, phone, company, message } = body;
  const safe = (v: string | undefined) => (v ? escapeHtml(String(v)) : '-');
  const emailHtml = email ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : '-';

  const lines: string[] = [
    '✉️ Direct Message',
    '',
    `Name: ${safe(name)}`,
    `Email: ${emailHtml}`,
    `Phone: ${safe(phone)}`,
    `Company: ${safe(company)}`,
    '',
    `Message: ${safe(message)}`,
  ];

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
  req: any,
  res: any
) {
  try {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { success: false, message: 'Method not allowed' });
    }

    const body = getJsonBody<ApplicationBody>(req);
    const { fullText, flow } = body;

    // Legacy: accept preformatted fullText
    const text = fullText
      ? fullText
      : flow
        ? formatApplyFlowMessage(body)
        : formatDriverApplicationMessage(body);

    // Validate: need either fullText or structured fields
    if (!fullText && !flow) {
      const { name, phone } = body;
      if (!name || !phone) {
        return sendJson(res, 400, {
          success: false,
          message: 'Name and phone are required',
        });
      }
    }

    if (flow === 'apply_step1') {
      const { leadId, name, phone, email, driverType } = body;
      if (!leadId || !name || !phone || !email || !driverType) {
        return sendJson(res, 400, {
          success: false,
          message: 'Step 1 requires leadId, name, phone, email, and driverType',
        });
      }
      const emailTrim = String(email).trim();
      if (!emailTrim.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
        return sendJson(res, 400, {
          success: false,
          message: 'Please enter a valid email address',
        });
      }
    }

    if (flow === 'apply_step2') {
      const { leadId, yearsExperience, state, sapProgram, duiDwi } = body;
      if (!leadId || !yearsExperience || !state || !sapProgram || !duiDwi) {
        return sendJson(res, 400, {
          success: false,
          message: 'Step 2 requires leadId, yearsExperience, state, sapProgram, and duiDwi',
        });
      }
    }

    if (flow === 'apply_step2_skipped') {
      if (!body.leadId) {
        return sendJson(res, 400, {
          success: false,
          message: 'Skipped step 2 requires leadId',
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

    return sendJson(res, 200, { success: true, leadId: body.leadId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('applicationsHandler error:', err);
    return sendJson(res, 500, { success: false, message });
  }
}

export async function quoteHandler(
  req: any,
  res: any
) {
  try {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { success: false, message: 'Method not allowed' });
    }

    const body = getJsonBody<QuoteBody>(req);
    const { name, email, phone, from, to } = body;

    if (!name || !email || !phone || !from || !to) {
      return sendJson(res, 400, {
        success: false,
        message: 'Name, email, phone, from, and to are required',
      });
    }

    const text = formatQuoteMessage(body);
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
    console.error('quoteHandler error:', err);
    return sendJson(res, 500, { success: false, message });
  }
}

export async function contactHandler(
  req: any,
  res: any
) {
  try {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { success: false, message: 'Method not allowed' });
    }

    const body = getJsonBody<ContactBody>(req);
    const { name, email, phone, message } = body;

    if (!name || !message || (!email && !phone)) {
      return sendJson(res, 400, {
        success: false,
        message: 'Name, message, and at least one contact method (email or phone) are required',
      });
    }

    const text = formatContactMessage(body);
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
    console.error('contactHandler error:', err);
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
    const body = getJsonBody<HandleUploadBody>(req);
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
app.post('/api/quote', quoteHandler);
app.post('/api/contact', contactHandler);

export default applicationsHandler;
