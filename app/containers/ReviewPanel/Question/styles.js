import styled from 'styled-components';
import TagsList from 'components/TagsList';
import { white, purpleDark } from 'shared/styles/colors';
import { centerByMargin } from 'shared/styles/layout';
import { giga } from 'shared/styles/typography';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  text-align: center;
  flex: 1 1 100%;
`;

export const QuestionWrapper = styled.div`
  flex: 999 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Question = styled.h1`
  ${giga}
  ${centerByMargin};
  color: ${white};
  font-weight: 700;
  letter-spacing: -0.03em;
  text-shadow: .1em .2em .4em ${purpleDark};
  padding: 2em .5em;
`;

export const Tags = styled(TagsList)`
  display: flex;
  align-self: flex-start;
  flex-flow: row wrap;
  justify-content: flex-start;
  z-index: 2;
`;