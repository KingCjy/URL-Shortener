import * as db from '../database/database';
import { getHeapStatistics } from 'v8';

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

export async function findRedirectUrl (key) {
  const connection = await db.getConnection();

  let redirectUrl;
  if(isNaN(key) == false) {
      redirectUrl = await db.selectOne(connection, 'SELECT * FROM short_url WHERE id = ?', [key]);
      return redirectUrl.url;
  }  
  
  redirectUrl = await db.selectOne(connection, 'SELECT * FROM short_url WHERE short_url = ?', [key])

  await countRedirectUrl(redirectUrl.id);
  return redirectUrl.url;
}

async function countRedirectUrl(id) {
    const connection = await db.getConnection();

    await db.query(connection, 'INSERT INTO redirect_history (short_url_id) VALUES (?)', [id]);
    return;
}

export async function stats(key) {
    const connection = await db.getConnection();
    let shortUrl;
    if(isNaN(key) == false) {
        shortUrl = await db.selectOne(connection, 'SELECT * FROM short_url WHERE id = ?', [key]);
    } else {
        shortUrl = await db.selectOne(connection, 'SELECT * FROM short_url WHERE short_url = ?', [key]) 
    }

    let result = await getStats(shortUrl.id);
    return result;
}

async function getStats(id) {
    const connection = await db.getConnection();

    let result = await db.query(connection, 'SELECT LEFT(create_date_time, 16) AS `at`, COUNT(1) as visit from redirect_history WHERE short_url_id = ? group by left(create_date_time, 16)', [id]);
    return result;
}
