import React from 'react';
import PropTypes from 'prop-types';
import titlecase from 'voca/title_case';
import { branch, renderNothing } from 'recompose';

import { SRS_RANKS } from 'shared/constants';
import VocabList from 'components/VocabList';
import StripeHeading from 'components/StripeHeading';
import { Wrapper } from './styles';

RankedVocabList.propTypes = {
  rank: PropTypes.oneOf(Object.values(SRS_RANKS)).isRequired,
  ids: PropTypes.array.isRequired,
  color: PropTypes.string.isRequired,
  cardsExpanded: PropTypes.bool.isRequired,
};

function RankedVocabList({ rank, ids, color, cardsExpanded }) {
  return (
    <Wrapper>
      <StripeHeading text={titlecase(rank)} count={ids.length} />
      <VocabList ids={ids} color={color} isExpanded={cardsExpanded} />
    </Wrapper>
  );
}

const enhance = branch(({ ids }) => !ids.length, renderNothing);

export default enhance(RankedVocabList);
