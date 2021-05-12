import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { DisplayText, TextBlock } from '../common/typography';
import Button from '../common/Button';

import { disFlexColumn } from '../../styles/mixins';

const StyledDiv = styled('div')`
  ${disFlexColumn(undefined, 'center')};
  line-height: 24px;

  .description-container {
    margin-bottom: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .description {
    text-align: center;
    margin: 60px 0 30px;
  }

  @media (min-width: 767px) {
    margin-top: 100px;
  }
`;

const Step1 = ({ startNextStep }) => (
  <StyledDiv>
    <DisplayText>This is super important.</DisplayText>
    <div className="description-container">
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
    </div>
    <Button onClick={startNextStep} isPrimary>
      Reveal Secret Link
    </Button>
  </StyledDiv>
);

Step1.propTypes = {
  startNextStep: PropTypes.func,
};

export default Step1;
