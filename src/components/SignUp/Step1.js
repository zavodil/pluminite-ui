import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { disFlexColumn } from '../../styles/mixins';
import { DisplayText, TextBlock } from '../common/typography';

const StyledDiv = styled('div')`
  ${disFlexColumn(undefined, 'center')};
  line-height: 24px;

  .description {
    text-align: center;
    margin: 60px 0 30px;
  }

  .button-reveal {
    width: 343px;
    margin-top: 50px;
    font-size: 16px;
  }
`;

const Step1 = ({ startNextStep }) => (
  <StyledDiv>
    <DisplayText>This is super important.</DisplayText>
    <p className="description">
      You’re about to see a secret link.
      <br />
      This link is the only way you can log back into this app,
      <br />
      until your NEAR wallet is funded.
    </p>
    <TextBlock isCritical title="Critical">
      No one can recover this link, so do not lose or share this link with anyone.
    </TextBlock>
    <button className="button-reveal" onClick={startNextStep}>
      Reveal Secret Link
    </button>
  </StyledDiv>
);

Step1.propTypes = {
  startNextStep: PropTypes.func,
};

export default Step1;
