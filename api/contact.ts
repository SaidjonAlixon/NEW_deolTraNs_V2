import { contactHandler } from './applications.ts';

export default function handler(req: any, res: any) {
  return contactHandler(req, res);
}

