import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cuid from 'cuid';
import { compose, branch, renderNothing } from 'recompose';
import { createSelector } from 'reselect';

import { makeSelectReviewReadings, selectVocabularySettings } from 'shared/selectors';

import VocabEntryReading from './VocabEntryReading';

import { Ul } from './styles';

VocabEntryReadings.propTypes = {
  readings: PropTypes.array.isRequired,
  useEijiroPro: PropTypes.bool.isRequired,
};

function VocabEntryReadings({ readings, ...props }) {
  return (
    <Ul>
      {readings.map((reading) => <VocabEntryReading key={cuid()} {...reading} {...props} />)}
    </Ul>
  );
}

const mapStateToProps = (state, { id }) => ({
  readings: makeSelectReviewReadings(id)(state),
  useEijiroPro: createSelector(selectVocabularySettings, ({ useEijiroPro }) => useEijiroPro)(state),
});

const enhance = compose(
  connect(mapStateToProps),
  branch(({ readings }) => !readings.length, renderNothing),
);

export default enhance(VocabEntryReadings);