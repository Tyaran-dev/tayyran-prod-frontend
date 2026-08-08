import { decode } from 'html-entities';

export function decodeHtml(html: string): string {
  return decode(html);
}