import { shortURL } from '../services/url.service.js';

export function createShortURL(req, res) {
  const { url } = req.body;

  console.log(url);

  const shorturl = shortURL(url); // service
  
  return res.send({
    shorturl: shorturl
  });
}