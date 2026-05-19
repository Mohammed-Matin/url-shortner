import ShortURL from '../models/shorturl.model.js';

export const insertURL = async (full_url, short_url, user_id) => {
  const newShortURL = new ShortURL({
    full_url,
    short_url,
  })
  if(user_id) {
    newShortURL.user = user_id
  }
  newShortURL.save();

  return newShortURL;
}

export const getAndIncURL = async (short_url) => {
  const urlData = await ShortURL.findOne({ short_url });

  if (urlData) {
    urlData.clicks++;
    await urlData.save();
  }

  return urlData;
}