import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { StickedToBottom } from '../common/layout';
import Button from '../common/Button';

const Container = styled('div')``;

const StyledButton = styled(Button)`
  width: 50%;

  :first-of-type {
    margin-right: 10px;
  }
`;

function ProfileEditPhoto({ processSave }) {
  return (
    <Container>
      <StickedToBottom isSecondary>
        <StyledButton isSecondary>
          <Link to="/profile">Cancel</Link>
        </StyledButton>
        <StyledButton isPrimary>
          <Link to="/profile" onClick={processSave}>
            Save
          </Link>
        </StyledButton>
      </StickedToBottom>
    </Container>
  );
}

ProfileEditPhoto.propTypes = {
  processSave: PropTypes.func.isRequired,
};

export default ProfileEditPhoto;
