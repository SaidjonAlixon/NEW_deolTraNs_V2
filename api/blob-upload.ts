import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error('BLOB_READ_WRITE_TOKEN is not configured');
    return res.status(500).json({ error: 'Blob storage is not configured' });
  }

  const body = getJsonBody<HandleUploadBody>(req);

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req as any,
      token,
      onBeforeGenerateToken: async () => {
        return {
          addRandomSuffix: true,
          access: 'public',
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
        };
      },
      onUploadCompleted: async () => {
        // optional hook for logging
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error: any) {
    console.error('Blob handleUpload error', error);
    return res
      .status(400)
      .json({ error: error?.message || 'Upload error' });
  }
}

