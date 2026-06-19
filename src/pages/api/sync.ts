import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import crypto from 'crypto';

const SECRET = process.env.SYNC_WEBHOOK_SECRET || '';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const signature = req.headers['x-sync-signature'] as string | undefined;
  const payload = JSON.stringify(req.body);
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');

  if (!signature || signature !== expected) {
    res.status(401).end('Invalid signature');
    return;
  }

  exec('bash ./build.sh sync', (err, stdout, stderr) => {
    if (err) {
      console.error('Sync error:', err);
      res.status(500).json({ ok: false, error: err.message });
      return;
    }
    res.status(200).json({ ok: true, output: stdout });
  });
}
