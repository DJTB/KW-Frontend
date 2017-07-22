import isKanji from 'wanakana/isKanji';
import isJapanese from 'wanakana/isJapanese';
import isKana from 'wanakana/isKana';

export const onlyKanjiKana = (value = '') =>
  isJapanese(value) ? undefined : 'Must be a mix of kanji and okurigana';

export const onlyKana = (value = '') =>
  isKana(value) ? undefined : 'Must be hiragana or katakana';

export const onlyKanjiOrKana = (value = '') =>
  (isKanji(value) || isJapanese(value) || isKana(value)) ?
    undefined : 'Must be kana, kanji, or a mix of both';

export const resetConfirmation = (value, matcher) =>
  value === matcher ? undefined : 'Does not match';

export const required = (value) =>
  value ? undefined : 'Required';

export const number = (value) =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined;

export const email = (value) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
  'Invalid email address' : undefined;
