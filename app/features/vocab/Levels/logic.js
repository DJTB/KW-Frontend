import { createLogic } from 'redux-logic';

import vocab from 'features/vocab/actions';
import notify from 'features/notifications/actions';

export const levelsLoadLogic = createLogic({
  type: vocab.levels.load.request,
  warnTimeout: 10000,
  process({ api, serializers }, dispatch, done) {
    api.vocab.level
      .fetchAll()
      .then((response) => {
        const levels = serializers.serializeLevelsResponse(response);
        dispatch(vocab.levels.load.success(levels));
        done();
      })
      .catch(({ status, response, message, ...rest }) => {
        dispatch(
          notify.error({
            content: 'Unable to load levels. You may be experiencing connection problems.',
          })
        );
        dispatch(vocab.levels.load.failure({ status, response, message, ...rest }));
        done();
      });
  },
});

export default [levelsLoadLogic];
