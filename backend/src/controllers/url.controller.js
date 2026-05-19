import { shortURL, fullURL } from "../services/url.service.js";
import config from "../configs/config.config.js";
import { asyncHandler } from "../utils/errors/async-handler.js";
import { ControllerError } from "../utils/errors/app-error.js";
import { rejectUnexpectedData } from "../utils/errors/validation.js";

export const createShortURL = asyncHandler(async (req, res) => {
  rejectUnexpectedData(req, { allowedBody: ["url"] });

  if (!req.body?.url) {
    throw new ControllerError({
      message: "url isn't there in the request.",
      statusCode: 400,
      code: "INVALID_INPUT",
      details: { field: "url", reason: "required" },
    });
  }

  if (typeof req.body.url !== "string") {
    throw new ControllerError({
      message: "url must be a string.",
      statusCode: 400,
      code: "INVALID_INPUT",
      details: { field: "url", reason: "must be string" },
    });
  }

  const { url } = req.body;

  const shorturl = await shortURL(url); // service - without user
  // const shorturl = await shortURL(url, user_id); // service - with user

  res.status(201).json({
    message: "ShortURL created successfully",
    URL: {
      fullURL: shorturl.full_url,
      shortURL: shorturl.short_url,
      clicks: shorturl.clicks,
    },
    short_url: config.APP_URL + shorturl.short_url,
  });
});

export const getFullURL = asyncHandler(async (req, res) => {
  rejectUnexpectedData(req, { allowedParams: ["shortId"] });

  const { shortId } = req.params;

  if (!shortId) {
    throw new ControllerError({
      message: "Short ID parameter is missing.",
      statusCode: 400,
      code: "INVALID_PATH_PARAM",
      details: { field: "shortId", reason: "required" },
    });
  }

  const urlData = await fullURL(shortId);

  if (!urlData) {
    throw new ControllerError({
      message: "Short URL not found.",
      statusCode: 404,
      code: "RESOURCE_NOT_FOUND",
      details: { shortId },
    });
  }

  res.redirect(urlData.full_url);
});
