import { generateNanoId } from "../utils/helper.js";
import { insertURL, getAndIncURL } from "../repositories/url.repository.js";
import { ServiceError } from "../utils/errors/app-error.js";

export async function shortURL(full_url, user_id) {
  if (!full_url?.trim()) {
    throw new ServiceError({
      message: "URL is required to create a short link.",
      statusCode: 400,
      code: "URL_REQUIRED",
    });
  }

  let normalizedURL;
  try {
    normalizedURL = new URL(full_url).toString();
  } catch {
    throw new ServiceError({
      message: "Provided URL is invalid.",
      statusCode: 422,
      code: "INVALID_URL",
      details: { value: full_url },
    });
  }

  const short_url = generateNanoId(7);

  if (!short_url) {
    throw new ServiceError({
      message: "Failed to generate short URL identifier.",
      statusCode: 500,
      code: "SHORT_ID_GENERATION_FAILED",
    });
  }

  try {
    const newShortURL = await insertURL(normalizedURL, short_url, user_id);

    return newShortURL;
  } catch (error) {
    throw new ServiceError({
      message: "Failed to create short URL.",
      statusCode: error.statusCode || 500,
      code: "SHORT_URL_CREATE_FAILED",
      details: { short_url },
      cause: error,
    });
  }
}

export async function fullURL(short_url) {
  if (!short_url?.trim()) {
    throw new ServiceError({
      message: "Short URL id is required.",
      statusCode: 400,
      code: "SHORT_ID_REQUIRED",
    });
  }

  // later, update for race condition
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
