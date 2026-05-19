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
    // Use findOneAndUpdate with $inc for an atomic update.
    // This finds the document and increments 'clicks' in a single,
    // race-condition-safe database operation.
    const urlData = await ShortURL.findOneAndUpdate(
      { short_url },
      { $inc: { clicks: 1 } },
      { returnDocument: "before" }, // returns the document *before* the update was applied
    );
    return urlData; // will be null if not found, or the old doc if found
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
