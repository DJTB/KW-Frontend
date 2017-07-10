import { createSelector } from 'reselect';
import isNumber from 'lodash/isNumber';
import pick from 'lodash/pick';
import calculatePercentage from 'utils/calculatePercentage';
import titleCase from 'voca/title_case';

export const selectError = (state) => state.global.ui.error;
export const selectProfile = (state) => state.global.user.profile;
export const selectDashboard = (state) => state.global.user.dashboard;
export const selectSettings = (state) => state.global.settings;
export const selectUi = (state) => state.global.ui;
export const createSelectSessionCount = (name) => createSelector(
  selectDashboard,
  (dashboard) => dashboard[`${name}Count`]
);
export const selectUserLevel = createSelector(selectProfile, (state) => state.currentLevel);
export const selectReviewCount = createSelectSessionCount('review');
export const selectLessonCount = createSelectSessionCount('lesson');

export const selectEntities = (state) => state.global.entities;
export const createSelectEntities = (name) => createSelector(
  selectEntities,
  (entities) => entities[name]
);
export const createSelectEntityById = (entity, id) => createSelector(
  createSelectEntities(entity),
  (entities) => entities[id],
);

export const selectReview = (state, props) => createSelectEntityById('reviews', props.id)(state);
export const selectIdFromParams = (_, props) => props.match.params.id;

export const selectLevels = createSelectEntities('levels');
export const selectLevelIds = createSelector(
  selectLevels,
  (levels) => Object.keys(levels),
);
export const selectLevel = (state, props) => createSelectEntityById('levels', props.id)(state);
export const makeSelectLevel = () => createSelector(selectLevel, (level) => level);
export const makeSelectLevelReviewIds = () => (state, props) => {
  const level = createSelectEntityById('levels', selectIdFromParams(null, props))(state);
  return level && level.reviews;
};

const isWithinUserWKLevel = (id, userLevel) => isNumber(id) && id <= userLevel;
const isNotNumberedLevel = (id) => !isNumber(id);

export const selectLevelTitle = (state, props) => isNotNumberedLevel(props.id) ? titleCase(props.id) : props.id;
export const selectLevelCount = createSelector(selectLevel, (level) => level.count);
export const selectLevelSubmitting = (state, props) => selectUi(state).level.submitting.includes(props.id);
export const selectLevelActionable = createSelector(
  [makeSelectLevel(), selectUserLevel, selectLevelSubmitting],
  ({ id }, userLevel, isSubmitting) => !isSubmitting && (isWithinUserWKLevel(id, userLevel) || isNotNumberedLevel(id)),
);

export const selectLevelLocked = createSelector(
  makeSelectLevel(),
  (level) => level.isLocked,
);

export const selectReviewCorrect = createSelector(
  selectReview,
  (review) => review && review.correct
);
export const selectReviewIncorrect = createSelector(
  selectReview,
  (review) => review && review.incorrect
);
export const selectReviewMeanings = createSelector(
  selectReview,
  (review) => review && review.vocabulary.meanings,
);
export const selectReviewReadings = createSelector(
  selectReview,
  (review) => review && review.vocabulary.readings,
);

const generateToolTip = (correct, incorrect, meanings, readings) => {
  const correctnessText = () => {
    const total = correct + incorrect;
    const previouslyAnswered = total > 0;
    return `${previouslyAnswered ? `${calculatePercentage(correct, total)}%` : '<small>N/A</small>'}`;
  };
  return `
  <ul>
    <li>
      <span>JA </span>
      <span lang="ja">${readings[0].kana[0]}</span>
    </li>
    <li>
      <span>EN</span>
      <span>${titleCase(meanings[0])}</span>
    </li>
    <li>
      <span>RC</span>
      <span>${correctnessText(correct, incorrect)}</span>
    </li>
  </ul>
  `;
};

export const selectVocabChipToolTipMarkup = createSelector(
  [selectReviewCorrect, selectReviewIncorrect, selectReviewMeanings, selectReviewReadings],
  generateToolTip,
);

export const selectSession = (state) => state.global.session;
export const selectQueue = (state) => state.global.session.queue;
export const selectCompleteCount = createSelector(selectSession, ({ complete }) => complete.length);
export const selectCorrectCount = createSelector(selectSession, ({ correct }) => correct.length);
export const selectCurrentItem = createSelector(
  [selectEntities, selectSession],
  (entities, { current }) => current && entities.reviews[current],
);

export const selectTotalCount = (state, { match: { params: { category } } }) =>
  category === 'reviews' ?
    selectReviewCount(state) :
    selectLessonCount(state);

export const selectRemainingCount = createSelector(
  [selectSession, selectTotalCount],
  ({ complete }, total) => Math.max((total - 1) /* 1 = current review */ - complete, 0),
);

export const makeSelectCorrectItems = () => createSelector(
  [selectEntities, selectSession],
  (entities, { correct }) =>
    correct && Object.values(pick(entities.reviews, correct))
);

export const makeSelectIncorrectItems = () => createSelector(
  [selectEntities, selectSession],
  (entities, { incorrect }) =>
    incorrect && Object.values(pick(entities.reviews, incorrect))
);

export const makeSelectCriticalItems = () => createSelector(
  [selectEntities, selectSession],
  (entities, { critical }) =>
    critical && Object.values(pick(entities.reviews, critical))
);

export const makeSelectPercentComplete = () => createSelector(
  [selectCorrectCount, selectTotalCount],
  (correct, total) => calculatePercentage(correct, total),
);

export const makeSelectPercentCorrect = () => createSelector(
  [selectCorrectCount, selectCompleteCount],
  (correct, complete) => calculatePercentage(correct, complete),
);
