import { generateNanoId } from '../utils/helper.js';
import { insertURL, getAndIncURL } from '../repositories/url.repository.js';

export async function shortURL(full_url, user_id) {
  const short_url = generateNanoId(7);

  const newShortURL = insertURL(full_url, short_url, user_id)

  return newShortURL;
}

export async function fullURL(short_url) {
  // later, update for race condition
  const urlData = await getAndIncURL(short_url);

  return urlData;
}
