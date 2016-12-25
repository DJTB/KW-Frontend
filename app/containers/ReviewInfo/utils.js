import {
  MAX_DETAIL_DEPTH,
  DETAIL_LEVELS,
} from './constants';

/**
 * Converts detail level number to a name
 * @param  {Number} level
 * @return {String}
 */
export const getDetailLevelName = (level) => DETAIL_LEVELS[level - 1]; // eslint-disable-line import/prefer-default-export

/**
 * Rotates through numbers without going above max depth
 * @param  {Number} [level=1]
 * @return {Number} Previous level incremented by 1 || 1 if above max depth
 */
export const getRotatedLevel = (level = 1) => {
  const newLevel = level + 1;
  return newLevel > MAX_DETAIL_DEPTH ? 1 : newLevel;
};

/**
 * Combines Common and JLPT with main tags (Parts of Speech)
 * @param  {Array} tags [description]
 * @param  {String} jlpt [description]
 * @param  {Bool} common [description]
 * @return {Array} [description]
 */
export const combineTags = (tags, jlpt, common) => {
  let ret = tags.slice();
  if (jlpt) ret = ret.push(jlpt);
  if (common) ret = ret.push('Common');
  return ret;
};
