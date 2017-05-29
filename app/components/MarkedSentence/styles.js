import styled from 'styled-components';
import { transparentize } from 'polished';

import P from 'base/P';
import Mark from 'base/Mark';

import { gutter } from 'shared/styles/layout';
import { transparent, greyDark, purpleLight } from 'shared/styles/colors';

export const Wrapper = styled.div`
  ${gutter({ type: 'outer' })}
`;

export const Sentence = styled(P)`
  line-height: 1;
  color: ${greyDark};

  &[lang="ja"] {
    font-size: 1.5em;
  }

  &:not([lang="ja"]) {
    font-size: 1.1em;
    font-style: italic;
  }
`;

export const VocabMark = styled(Mark)`
  background-color: ${transparent};
  color: ${transparentize(0.2, purpleLight)};
`;
