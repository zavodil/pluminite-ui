import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { utils } from 'near-api-js';

import { NearContext } from '../../contexts';

import Dropdown from '../common/Dropdown';

const { formatNearAmount } = utils.format;

const StyledSpan = styled('span')`
  color: var(--bubble-gum);
  height: 52px;
  line-height: 52px;

  .account-display-id {
    text-decoration: underline;
  }
`;

const AccountDisplay = ({ text, handleOnClick, className }) => (
  <StyledSpan className={`account-display ${className}`} onClick={handleOnClick}>
    Hi, <span className="account-display-id">{text}</span> :)
  </StyledSpan>
);

AccountDisplay.propTypes = {
  text: PropTypes.string,
  handleOnClick: PropTypes.func,
  className: PropTypes.string,
};

const StyledContainer = styled('div')`
  .dropdown-item {
    :first-child {
      margin-top: 17px;
    }

    :last-child {
      margin-bottom: 17px;
    }
  }

  .nav__link--dropdown {
    display: block;
    padding: 14px 30px;
    color: var(--lavendar);
    text-decoration: none;
    white-space: nowrap;
  }
`;

const UserDropdown = () => {
  const { user, signOut } = useContext(NearContext);

  const nearFormatted = formatNearAmount(user.balance);
  const nearRounded = Math.round(nearFormatted * 1000) / 1000;

  const signOutAction = () => {
    signOut();
  };

  return (
    <StyledContainer>
      <Dropdown dropdownBase={AccountDisplay} title={`${user.accountId}`} stretchable>
        <Link className="nav__link nav__link--dropdown" to="/mint">
          Mint a Gem
        </Link>
        <Link className="nav__link nav__link--dropdown" to="/profile">
          View profile
        </Link>
        <span className="nav__link nav__link--dropdown">Balance: {nearRounded}Ⓝ ~$WIP USD</span>
        <Link className="nav__link nav__link--dropdown" to="#" onClick={() => signOutAction()}>
          Log out
        </Link>
      </Dropdown>
    </StyledContainer>
  );
};

export default UserDropdown;
