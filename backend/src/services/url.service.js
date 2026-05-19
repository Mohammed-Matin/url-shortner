import { nanoid } from 'nanoid';
import ShortURL from '../models/shorturl.model.js';

export async function shortURL(full_url) {
  const short_url = nanoid(7);

  const newShortURL = await ShortURL.create({
    full_url,
    short_url
  })

  return newShortURL;
}