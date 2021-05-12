import { css } from 'styled-components';

export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const disFlexColumn = (justifyContent = 'flex-start', alignItems = 'flex-start') =>
  css`
    display: flex;
    flex-direction: column;
    justify-content: ${justifyContent};
    align-items: ${alignItems};
  `;

export const clearMarPad = css`
  margin: 0;
  padding: 0;
`;

export const absoluteTopLeft = (top = 0, left = 0) =>
  css`
    position: absolute;
    top: ${top};
    left: ${left};
  `;

export const absoluteTopRight = (top = 0, right = 0) =>
  css`
    position: absolute;
    top: ${top};
    right: ${right};
  `;
