import * as db from '../database/database';

export async function isDuplicateUrl (url) {
  const connection = await db.getConnection();
  let result = await db.selectOne(connection, 'SELECT count(1) AS count from short_url WHERE url = ?', [url]);

  return result.count > 0 ? true : false;
}

export async function registerUrl (url) {
  const connection = await db.getConnection();
  const shortUrl = await generateUrl();
  let result = await db.query(connection, "INSERT INTO short_url (url, short_url) VALUES (?, ?)", [url, shortUrl]);
  return shortUrl;
}

export async function findShortUrlFromUrl (url) {
  const connection = db.getConnection();
  let result = await db.selectOne(connection, 'SELECT * from short_url WHERE url = ?', [url]);
  return result;
}

export async function isDuplicateShortUrl (url) {
  const connection = await db.getConnection();
  let result = await db.selectOne(connection, 'SELECT count(1) AS count from short_url WHERE short_url = ?', [url]);
  return result.count > 0 ? true : false;
}

async function generateUrl() {
  let code = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
  let length = code.length;
  let result = '';

  for(let i = 0; i < 5; i++) {
    let char = code[Math.round(Math.random() * (length - 1))];
    result += char;
  }

  let shortUrl = await isDuplicateShortUrl(result);

  if(shortUrl) {
     return generateUrl();
  }

  return result;
}