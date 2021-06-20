import React from 'react';
import styled from 'styled-components';

import { DiamondIcon } from '~/components/common/icons';

import { HeadingText } from '~/components/common/typography';

const Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 28px;

  svg {
    height: 50px;
    width: 50px;
    filter: drop-shadow(var(--shadow-primary));
  }
`;

export default function NotFound404() {
  return (
    <Container>
      <HeadingText>
        Sorry :( <br /> No <DiamondIcon />
        &apos;s here
      </HeadingText>
    </Container>
  );
}
