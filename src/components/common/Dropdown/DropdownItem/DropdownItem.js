import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledLi = styled('li')`
    cursor: pointer;
`

const DropdownItem = ({ children }) => (
    <StyledLi className='dropdown-item'>
        {children}
    </StyledLi>
);

DropdownItem.propTypes = {
    children: PropTypes.node.isRequired,
    isDivider: PropTypes.bool,
};

export default DropdownItem;
