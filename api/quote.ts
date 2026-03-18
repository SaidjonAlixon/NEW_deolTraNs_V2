import { quoteHandler } from './applications.ts';

export default function handler(req: any, res: any) {
  return quoteHandler(req, res);
}

