import styled, { css } from "styled-components";
import { transparentize } from "polished";

import { gutter } from "common/styles/layout";
import { visuallyHidden } from "common/styles/utils";
import { grey } from "common/styles/colors";
import { fastEaseQuad } from 'common/styles/animation';

import IconButton from "common/components/IconButton";

const SIZE = 2.25;
const ICON_SIZE = 1.25;

export const Form = styled.form`
  ${gutter()}
  display: flex;
  width: 100%;
  max-width: 300px;
  align-self: center;
`;

export const Label = styled.label`
  ${visuallyHidden};
`;

// FIXME: sigh, button component is too specific
export const SubmitButton = styled(IconButton)`
  background-color: ${({ bgColor }) => bgColor} !important;
  margin: 0 !important;
  padding-top: ${ICON_SIZE / 2.2}em !important;
  padding-bottom: ${ICON_SIZE / 2.2}em !important;
  /* shift icon to the left a little */
  padding-left: ${ICON_SIZE / 3}em !important;
  padding-right: ${ICON_SIZE / 1.75}em !important;
  border-radius: 0 ${ICON_SIZE}em ${ICON_SIZE}em 0 !important;
`;

/* eslint-disable indent */
export const InputWrapper = styled.div`
  width: 100%;
  font-size: 1em;
  border: ${({ bgColor }) => css`1px solid ${transparentize(0.1, bgColor)}`};
  border-right-width: 0;
  border-radius: ${SIZE}em 0 0 ${SIZE}em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all ${fastEaseQuad};

  & > input {
    margin-left: ${SIZE / 2.25}em;
    padding-right: ${SIZE / 1.5}em;
    appearance: none !important;
    box-shadow: none !important;
    border: none !important;
    box-sizing: content-box;
    font-size: 1em;
    height: 1.2em;
    min-height: 2em;
    line-height: 2em;
    width: 100%;

    /* x icon on IE11 */
    &::-ms-clear {
      display: none;
      width:0;
      height:0;
      pointer-events: none;
    }

    &::placeholder {
      color: ${transparentize(0.1, grey[2])};
      line-height: '2em';
   }

    &:focus {
      outline: none;
      &::placeholder {
        color: ${transparentize(0.5, grey[2])};
        line-height: '2em';
      }
    }
  }
`;
