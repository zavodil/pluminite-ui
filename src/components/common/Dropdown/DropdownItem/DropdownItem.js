import React from 'react';
import styled from 'styled-components';

import { ReactChildrenTypeRequired } from '~/types/ReactChildrenTypes';

const StyledLi = styled('li')``;

const DropdownItem = ({ children }) => <StyledLi className="dropdown-item">{children}</StyledLi>;

DropdownItem.propTypes = {
  children: ReactChildrenTypeRequired,
};

export default DropdownItem;
