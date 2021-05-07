import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { flexCenter } from '../../styles/mixins';

const StyledDiv = styled('div')`
  ${flexCenter};
  height: 100%;

  .form-sign-up {
    max-width: 400px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  label {
    line-height: 24px;
    margin-bottom: 10px;
  }

  .name-input {
    margin-bottom: 30px;
    height: 55px;
    padding: 16px 14px;
    border: none;
    border-bottom: var(--lavendar) 1px solid;
    background-color: rgba(var(--periwinkle-base), 0.2);
    outline: none;
    font-size: 16px;
    color: white;
  }

  .name-details {
    font-size: 12px;
    line-height: 21px;
    color: var(--periwinkle);
  }

  .name-submit {
    height: 56px;
    margin-top: 50px;
    font-size: 16px;
    line-height: 24px;
  }
`;

const Step0 = ({ startNextStep }) => (
  <StyledDiv>
    <form className="form-sign-up" autoComplete="off">
      <div className="form-group">
        <label>Choose Username</label>
        <input className="name-input" type="text" name="name" id="name" required autoComplete="off" />
        <div className="name-details">
          This username will be your account name across the NEAR network, provided it gets funded from a sale. Choose
          carefully. :)
        </div>
      </div>
      <button className="button name-submit" type="submit" onClick={startNextStep}>
        Create Guest Account
      </button>
    </form>
  </StyledDiv>
);

Step0.propTypes = {
  startNextStep: PropTypes.func,
};

export default Step0;
