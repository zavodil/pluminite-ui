import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Dropdown from '../common/Dropdown';
import Hamburger from '../common/Hamburger';
import Balance from './Balance';

const DropdownBase = ({ handleOnClick, className }) => <Hamburger className={className} onClick={handleOnClick} />;

DropdownBase.propTypes = {
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

const ProfileUserMenu = () => {
  return (
    <StyledContainer>
      <Dropdown dropdownBase={DropdownBase} stretchable>
        <Link className="nav__link nav__link--dropdown" to="/">
          Back to marketplace
        </Link>
        <Link className="nav__link nav__link--dropdown" to="/mint">
          Mint a Gem
        </Link>
        <div className="nav__link nav__link--dropdown">
          Balance: <Balance />
        </div>
      </Dropdown>
    </StyledContainer>
  );
};

export default ProfileUserMenu;
