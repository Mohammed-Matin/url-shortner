import { nanoid } from 'nanoid';

export function shortURL() {
  return nanoid(7);
}