import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';

const StyledContainer = styled('div')`
  width: 100%;

  .tabs-titles {
    display: flex;
    margin-bottom: 30px;

    .tabs-title {
      position: relative;
      text-transform: uppercase;
      font-family: var(--font-secondary);
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 0.04em;
      cursor: pointer;

      :not(:last-of-type) {
        margin-right: 20px;
      }

      :hover {
        color: var(--bubble-gum);
      }

      &--active {
        color: var(--bubble-gum);

        :after {
          content: '';
          position: absolute;
          right: 0;
          bottom: -10px;
          left: 0;
          width: 33%;
          height: 4px;
          margin: auto;
          background-color: var(--bubble-gum);
          border-radius: var(--radius-default);
        }
      }
    }
  }

  .tabs-content {
    width: 100%;

    .tabs-tab {
      display: none;
      word-break: break-word;

      &--active {
        display: block;
      }
    }
  }

  @media (min-width: 767px) {
    .tabs-titles {
      justify-content: center;
    }
  }
`;

const Tabs = ({ tabsArray }) => {
  const [tabActiveIndex, setTabActiveIndex] = useState(0);

  return (
    <StyledContainer className="tabs">
      <div className="tabs-titles">
        {tabsArray.map(({ title }, index) => {
          return (
            <div
              key={`tab-title-${index}`}
              className={classNames('tabs-title', {
                'tabs-title--active': tabActiveIndex === index,
              })}
              onClick={() => setTabActiveIndex(index)}
            >
              {title}
            </div>
          );
        })}
      </div>
      <div className="tabs-content">
        {tabsArray.map(({ content }, index) => {
          return (
            <div
              key={`tab-content-${index}`}
              className={classNames('tabs-tab', {
                'tabs-tab--active': tabActiveIndex === index,
              })}
            >
              {content}
            </div>
          );
        })}
      </div>
    </StyledContainer>
  );
};

Tabs.propTypes = {
  tabsArray: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      tabsArray: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
    })
  ),
};

export default Tabs;
