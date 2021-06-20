import React, { useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';

import { useDetectClickOutside } from '~/hooks';

import DropdownItem from './DropdownItem';

import { disFlexColumn, absoluteTopRight } from '~/styles/mixins';

import { ReactChildrenType } from '~/types/ReactChildrenTypes';
import StylesType from '~/types/StylesType';

const Container = styled('div')`
  position: relative;
  z-index: 2;

  .dropdown__title {
    width: max-content;
    padding: 2px;
    cursor: pointer;
  }

  .dropdown__list {
    ${disFlexColumn('flex-start', 'stretch')};
    ${absoluteTopRight('100%')}

    list-style-type: none;
    min-width: 100%;
    padding: 0;
    margin-top: 20px;
    border-radius: 8px;
    border: 1px solid var(--bubble-gum);
    background: var(--plum);
    visibility: hidden;
    box-shadow: 0 0 74px rgba(190, 20, 205, 0.45);
  }

  .dropdown--opened .dropdown__list {
    visibility: visible;
  }
`;

const Dropdown = React.forwardRef(({ dropdownBase, title = '', listStyles = {}, children }, ref) => {
  const [isOpened, setIsOpened] = useState(false);
  const DropdownBase = dropdownBase;

  useImperativeHandle(ref, () => ({
    closeDropdown() {
      setIsOpened(false);
    },
  }));

  const switchDropdown = () => {
    setIsOpened(!isOpened);
  };

  const closeDropdown = () => {
    setIsOpened(false);
  };

  const dropdownRef = useRef(null);

  const handleClickOutside = () => {
    closeDropdown();
  };

  useDetectClickOutside(dropdownRef, handleClickOutside);

  return (
    <Container>
      <div
        className={classNames('dropdown', {
          'dropdown--opened': isOpened,
        })}
        ref={dropdownRef}
      >
        <DropdownBase text={title} handleOnClick={() => switchDropdown()} className="dropdown__title" />
        <ul className="dropdown__list" style={listStyles} onClick={closeDropdown}>
          {children.length > 1 ? (
            children.map((child, index) => <DropdownItem key={`dropdown-item-${index}`}>{child}</DropdownItem>)
          ) : (
            <DropdownItem>{children}</DropdownItem>
          )}
        </ul>
      </div>
    </Container>
  );
});

Dropdown.displayName = 'Dropdown';
Dropdown.propTypes = {
  dropdownBase: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, ReactChildrenType]),
  listStyles: StylesType,
  children: ReactChildrenType,
};

export default Dropdown;
