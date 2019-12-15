import { Request, Response } from 'express';
import * as registerService from './register-service';

export async function register (req: Request, res: Response) {
  const url = req.query.url;

  if (url === undefined) {
    console.log('undefind');
    res.status(400);
    res.json();
  }

  const isDuplicate = await registerService.isDuplicateURL(url);
  if (isDuplicate) {
    const shortUrl = await registerService.findShortUrlFromUrl(url);

    res.status(200);
    res.json({ url: 'http://localhost:3000/' + shortUrl });
  }

  const shortUrl = await registerService.registerURL(url);
  res.json({ url: 'http://localhost:3000/' + shortUrl });
}
