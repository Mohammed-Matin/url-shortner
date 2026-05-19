import ShortURL from "../models/shorturl.model.js";
import { RepositoryError } from "../utils/errors/app-error.js";

export const insertURL = async (full_url, short_url, user_id) => {
  try {
    const newShortURL = new ShortURL({
      full_url,
      short_url,
    });

    if (user_id) {
      newShortURL.user = user_id;
    }

    await newShortURL.save();

    return newShortURL;
  } catch (error) {
    throw new RepositoryError({
      message: "Database insert failed while creating short URL.",
      statusCode: 500,
      code: "DB_INSERT_FAILED",
      details: { short_url },
      cause: error,
    });
  }
};

export const getAndIncURL = async (short_url) => {
  try {
    const urlData = await ShortURL.findOne({ short_url });

    if (urlData) {
      urlData.clicks += 1;
      await urlData.save();
    }

    return urlData;
  } catch (error) {
    throw new RepositoryError({
      message: "Database read/update failed for short URL.",
      statusCode: 500,
      code: "DB_READ_UPDATE_FAILED",
      details: { short_url },
      cause: error,
    });
  }
};
