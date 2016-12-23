import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import * as COLORS from 'shared/styles/colors';
import {
  toggleNewSynonymPanel,
  toggleInfoPanels,
  toggleInfoDepth,
 } from 'containers/ReviewInfo/actions';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: rgb(${COLORS.greyLight});
  color: rgb(${COLORS.blackLight});
  padding: .2rem .5rem;
`;

const Toggle = styled.div`
  text-align: center;
  padding: .2rem .6rem;
  cursor: pointer;
  border: 1px solid brown;
`;

function ToggleBar({ _toggleNewSynonymPanel, _toggleInfoPanels, _toggleInfoDepth }) {
  return (
    <Wrapper>
      <Toggle onClick={_toggleInfoDepth}>All Details</Toggle>
      <Toggle onClick={_toggleInfoPanels}>Toggle Info</Toggle>
      <Toggle onClick={_toggleNewSynonymPanel}>Add Synonym</Toggle>
    </Wrapper>
  );
}

ToggleBar.propTypes = {
  _toggleNewSynonymPanel: PropTypes.func.isRequired,
  _toggleInfoPanels: PropTypes.func.isRequired,
  _toggleInfoDepth: PropTypes.func.isRequired,
};

const mapStateToProps = () => createStructuredSelector({

});

const mapDispatchToProps = (dispatch) => ({
  _toggleNewSynonymPanel: () => dispatch(toggleNewSynonymPanel()),
  _toggleInfoPanels: () => dispatch(toggleInfoPanels()),
  _toggleInfoDepth: () => dispatch(toggleInfoDepth()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleBar);
