import { nanoid } from "nanoid";
import ShortURL from "../models/shorturl.model.js";

export async function shortURL(full_url) {
  const short_url = nanoid(7);

  const newShortURL = await ShortURL.create({
    full_url,
    short_url,
  });

  return newShortURL;
}

export async function fullURL(short_url) {
  // later, update for race condition
  const urlData = await ShortURL.findOne({ short_url });

  if (urlData) {
    urlData.clicks++;
    await urlData.save();
  }

  return urlData;
}
