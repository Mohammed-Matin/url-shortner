import { shortURL, fullURL } from "../services/url.service.js";
import config from '../configs/config.config.js';

export async function createShortURL(req, res) {
  if (!req.body.url) {
    return res.status(409).json({
      message: "url isn't there in the request.",
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
    short_url: config.APP_URL + shorturl.short_url
  });
}

export async function getFullURL(req, res) {
  const { shortId } = req.params;

  if (!shortId) {
    return res.status(400).json({
      message: "Short ID parameter is missing.",
    });
  }

  const urlData = await fullURL(shortId);

  if (!urlData) {
    return res.status(404).json({
      message: "Short URL not found.",
    });
  }

  res.redirect(urlData.full_url);

  return;
}