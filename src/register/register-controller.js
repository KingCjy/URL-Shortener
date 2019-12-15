import { Request, Response } from 'express';
import * as registerService from './register-service';

export async function register (req, res) {
  const url = encodeURIComponent(req.query.url);

  if (url === undefined) {
    res.status(400);
    res.json();
  }
  

  const isDuplicate = await registerService.isDuplicateUrl(url);
  if (isDuplicate) {
    const shortUrl = await registerService.findShortUrlFromUrl(url);

    res.status(200);
    res.json({ url: 'http://localhost:3000/' + shortUrl.short_url });
    return;
  }
  const shortUrl = await registerService.registerUrl(url);
  res.status(201);
  res.json({ url: 'http://localhost:3000/' + shortUrl });
}
