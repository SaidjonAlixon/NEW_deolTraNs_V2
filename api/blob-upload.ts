import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error('BLOB_READ_WRITE_TOKEN is not configured');
    return res.status(500).json({ error: 'Blob storage is not configured' });
  }

  const body = req.body as HandleUploadBody;

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

