
/**
 * Determines if review item is critical by comparing correct answers against total times answered
 * @param  {object} review Item to check
 * @param  {number} [threshold=0.75] Level below which item is considered critical
 * @return {boolean} True if item is below critical threshold
 */
function isCritical(review, threshold = 0.75) { // eslint-disable-line import/prefer-default-export
  const correctTotal = review.getIn(['history', 'correct']) + review.getIn(['session', 'correct']);
  const answeredTotal = review.getIn(['history', 'incorrect']) + review.getIn(['session', 'incorrect']) + correctTotal;
  const correctRatio = correctTotal / answeredTotal;

  return correctRatio < threshold;
}

export default isCritical;
