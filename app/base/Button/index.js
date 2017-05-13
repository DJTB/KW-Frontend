import React, { Children } from 'react';
import PropTypes from 'prop-types';

import { whiteLight, blue, blueDark } from 'shared/styles/colors';
import { StyledA, StyledButton } from './styles';


Button.propTypes = {
  plainButton: PropTypes.bool,
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['submit', 'reset', 'button']),
  href: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  to: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  onClick: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  color: PropTypes.string,
  colorHover: PropTypes.string,
  bgColor: PropTypes.string,
  bgColorHover: PropTypes.string,
};

Button.defaultProps = {
  type: 'button',
  plainButton: false,
  href: '',
  to: '',
  onClick: false,
  color: whiteLight,
  colorHover: blueDark,
  bgColor: blue,
  bgColorHover: whiteLight,
};

function Button({ plainButton, children, type, href, to, onClick, disabled, ...props }) {
  const link = () => (
    <StyledA
      plainLink
      href={href}
      to={to}
      disabled={disabled}
      {...props}
    >
      {Children.toArray(children)}
    </StyledA>
  );

  const button = () => (
    <StyledButton
      plainButton={plainButton}
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Children.toArray(children)}
    </StyledButton>
  );

  // minor optimization by only rendering one item, if these were variables instead of functions the unreturned item would still be created/rendered internally - then thrown away
  return (href || to) ?
    link() :
    button();
}

export default Button;
