import { generateNanoId } from "../utils/helper.js";
import { insertURL, getAndIncURL } from "../repositories/url.repository.js";
import { ServiceError } from "../utils/errors/app-error.js";

export async function shortURL(full_url, user_id) {
  let normalizedURL;
  try {
    const parsedUrl = new URL(full_url);
    if (!(parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:")) {
      throw new Error("Invalid protocol. Only HTTP and HTTPS are allowed.");
    }
    normalizedURL = parsedUrl.toString();
  } catch (error) {
    throw new ServiceError({
      message: error.message || "Provided URL is invalid.",
      statusCode: 422,
      code: "INVALID_URL",
      details: { value: full_url },
    });
  }

  const MAX_RETRIES = 3;
  for (let i = 0; i < MAX_RETRIES; i++) {
    const short_url = generateNanoId(7);

    try {
      const newShortURL = await insertURL(normalizedURL, short_url, user_id);
      return newShortURL; // Success, exit the loop and function
    } catch (error) {
      // Check if the error is a MongoDB duplicate key error (code 11000)
      if (error.cause?.code === 11000) {
        // This is a collision. If we've used all our retries, throw an error.
        if (i === MAX_RETRIES - 1) {
          throw new ServiceError({
            message:
              "Failed to create unique short URL after multiple attempts.",
            statusCode: 500,
            code: "SHORT_URL_CREATION_FAILED",
            cause: error,
          });
        }
        // Otherwise, the loop will continue and we'll try again with a new ID.
      } else {
        // It's a different kind of error, so re-throw it immediately.
        throw error;
      }
    }
  }
}

export async function fullURL(short_url) {
  try {
    const urlData = await getAndIncURL(short_url);

    return urlData;
  } catch (error) {
    throw new ServiceError({
      message: "Failed to fetch full URL.",
      statusCode: error.statusCode || 500,
      code: "SHORT_URL_FETCH_FAILED",
      details: { short_url },
      cause: error,
    });
  }
}
