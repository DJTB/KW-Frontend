import { createLogic } from 'redux-logic';
import { isJapanese, isKana } from 'wanakana';
import isEmpty from 'lodash/isEmpty';
import flatMap from 'lodash/flatMap';

import { recordReview } from 'shared/api';
import { SRS_RANGES } from 'shared/constants';
import fixTerminalN from 'utils/fixTerminalN';
import increment from 'utils/increment';
import decrement from 'utils/decrement';
import determineCriticality from 'utils/determineCriticality';
import stripTilde from 'utils/stripTilde';

import app from 'containers/App/actions';
import {
  selectPreviouslyIncorrect,
  selectQuizSettings,
  selectQueue,
  selectRemainingCount,
  selectCurrent,
} from 'containers/App/selectors';

import quiz from './actions';
import { selectQuizAnswer } from './selectors';

// set in quiz.advance and hold onto for clearing in quiz.answer.record
let autoAdvanceTimeout;

const isInputValid = (input = '') => !isEmpty(input) && isJapanese(input);
const cleanseInput = (input = '') => fixTerminalN(input.trim());

function flattenAnswers({ synonyms, vocabulary: { readings } }) {
  return flatMap(
    [...readings, ...synonyms],
    ({ character, kana }) => [character, ...kana]
  ).map((text) => ({ originalText: text, cleanAnswer: stripTilde(text) }));
}

function findMatch(input = '', review) {
  const cleanInput = stripTilde(input);
  const match = flattenAnswers(review).find(({ cleanAnswer }) => cleanAnswer === cleanInput);
  return match ? match.originalText : '';
}

export const submitAnswerLogic = createLogic({
  type: quiz.answer.submit,
  latest: true,
  process({ getState, action: { payload: { category } } }, dispatch, done) {
    const state = getState();
    const { value, isDisabled, isCorrect, isIncorrect } = selectQuizAnswer(state);
    const current = selectCurrent(state, { category });
    const previouslyIncorrect = selectPreviouslyIncorrect(state, { category });
    const answerValue = cleanseInput(value);
    const isValid = isInputValid(answerValue);

    if (!isValid) {
      dispatch(quiz.answer.update({ isMarked: true, isValid: false }));
    }

    if (!isDisabled && isValid) {
      dispatch(quiz.answer.check({ category, current, answerValue, previouslyIncorrect }));
    }

    if (isDisabled && isValid) {
      if (isIncorrect) {
        dispatch(quiz.answer.incorrect({ category, current }));
      }
      dispatch(quiz.answer.record.request({ category, current, isCorrect, isIncorrect, previouslyIncorrect }));
    }

    done();
  },
});

export const checkAnswerLogic = createLogic({
  type: quiz.answer.check,
  latest: true,
  process({ getState, action: { payload: { category, current, answerValue, previouslyIncorrect } } }, dispatch, done) {
    const { autoAdvance, autoExpandCorrect, autoExpandIncorrect } = selectQuizSettings(getState());
    const matchedAnswer = findMatch(answerValue, current);
    const type = isKana(answerValue) ? 'kana' : 'kanji';
    const updatedAnswer = {
      type,
      value: answerValue,
      focus: false,
      isMarked: true,
      isValid: true,
      isDisabled: true,
      isCorrect: false,
      isIncorrect: false,
    };

    if (matchedAnswer) {
      dispatch(quiz.answer.update({ ...updatedAnswer, value: matchedAnswer, isCorrect: true }));
      dispatch(quiz.answer.correct({ current, category }));
      dispatch(quiz.info.update({ isDisabled: false, detailLevel: 1 }));

      if (autoExpandCorrect && autoAdvance.speed > 0) {
        dispatch(quiz.info.update({ activePanel: 'INFO' }));
      }
    }

    if (!matchedAnswer) {
      dispatch(quiz.answer.update({ ...updatedAnswer, isIncorrect: true }));
      dispatch(quiz.info.update({ isDisabled: false, detailLevel: 0 }));
      if (autoExpandIncorrect) {
        dispatch(quiz.info.update({ activePanel: 'INFO' }));
      }
      if (previouslyIncorrect) {
        dispatch(quiz.answer.incorrect({ category, current }));
      }
    }

    done();
  },
});

export const incorrectAnswerLogic = createLogic({
  type: quiz.answer.incorrect,
  latest: true,
  process({ action: { payload: { category, current } } }, dispatch, done) {
    const incorrect = increment(current.incorrect);
    // double decrement if close to burned
    const streak = [...SRS_RANGES.THREE, ...SRS_RANGES.FOUR].includes(streak) ?
      decrement(current.streak - 1) :
      decrement(current.streak);
    const updatedReview = {
      ...current,
      incorrect,
      streak,
      isCritical: determineCriticality(current.correct, incorrect),
    };
    dispatch(app[category].current.update(updatedReview));
    done();
  },
});

export const correctAnswerLogic = createLogic({
  type: quiz.answer.correct,
  latest: true,
  process({ getState, action: { payload: { current, category } } }, dispatch, done) {
    const { autoAdvance } = selectQuizSettings(getState());
    if (autoAdvance.active) {
      dispatch(quiz.advance({ category, autoAdvance }));
    }
    const correct = increment(current.correct);
    const streak = increment(current.streak);
    const updatedReview = {
      ...current,
      correct,
      streak,
      isCritical: determineCriticality(correct, current.incorrect),
    };
    dispatch(app[category].current.update(updatedReview));
    done();
  },
});

export const ignoreAnswerLogic = createLogic({
  type: quiz.answer.ignore,
  validate({ getState, action }, allow, reject) {
    clearTimeout(autoAdvanceTimeout);
    const { isMarked, isDisabled, isCorrect, isIncorrect } = selectQuizAnswer(getState());
    if ((isMarked && isDisabled) && (isCorrect || isIncorrect)) {
      allow(action);
    } else {
      reject();
    }
  },
  process({ action: { payload: { category } } }, dispatch, done) {
    dispatch(quiz.answer.update({ isIgnored: true }));
    dispatch(quiz.info.reset());
    // allow animation to occur
    setTimeout(() => {
      dispatch(app[category].current.return());
      dispatch(quiz.answer.reset());
      done();
    }, 700);
  },
});

export const recordAnswerLogic = createLogic({
  type: quiz.answer.record.request,
  process({ action: { payload: { category, current, isCorrect, previouslyIncorrect } } }, dispatch, done) {
    const { id } = current;
    clearTimeout(autoAdvanceTimeout);
    dispatch(app.review.update(current));
    dispatch(app[category][isCorrect ? 'correct' : 'incorrect'].add(id));
    dispatch(app[category].current.set());
    dispatch(quiz.answer.reset());
    dispatch(quiz.info.reset());

    recordReview({ id, isCorrect, previouslyIncorrect })
      .then(() => {
        dispatch(quiz.answer.record.success({ isCorrect, category }));
        done();
      })
      .catch((err) => {
        dispatch(quiz.answer.record.failure(err));
        done();
      });
  },
});

export const loadMoreQueueLogic = createLogic({
  type: quiz.answer.record.success,
  process({ getState, action: { payload: { isCorrect, category } } }, dispatch, done) {
    if (isCorrect) {
      const state = getState();
      const queue = selectQueue(state, { category });
      const remainingCount = selectRemainingCount(state, { category });
      const moreQueueNeeded = queue.length < 15 && remainingCount > queue.length;
      console.log({ queueLength: queue.length, remainingCount, moreQueueNeeded });
      if (moreQueueNeeded) {
        dispatch(app[category].queue.load.request());
      }
    }
    done();
  },
});

export const autoAdvanceLogic = createLogic({
  type: quiz.advance,
  process({ action: { payload: { autoAdvance, category } } }, dispatch, done) {
    autoAdvanceTimeout = setTimeout(() => {
      dispatch(quiz.answer.submit({ category }));
      done();
    }, autoAdvance.speed);
  },
});

export default [
  submitAnswerLogic,
  ignoreAnswerLogic,
  checkAnswerLogic,
  incorrectAnswerLogic,
  correctAnswerLogic,
  recordAnswerLogic,
  autoAdvanceLogic,
  loadMoreQueueLogic,
];
