import React from 'react';
import styled from 'styled-components';

import Button from './Button';

const StyledContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  border-radius: var(--radius-default);
  // todo: use variables for 'rx='8' ry='8' (border-radius) stroke='%23${'F8DDFF'}' (lavendar)'
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23${'F8DDFF'}' stroke-width='3' stroke-dasharray='10 10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");

  :after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  #file-uploader {
    display: none;
  }
`;

const ArtDropzone = () => (
  <StyledContainer className="select">
    <Button as="label" for="file-uploader" isSecondary>
      Select Art
    </Button>
    <input id="file-uploader" type="file" />
  </StyledContainer>
);

export default ArtDropzone;
