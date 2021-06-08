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

export const hideArrowsForNumberInput = css`
  // Chrome, Safari, Edge, Opera
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  // Firefox
  [type='number'] {
    -moz-appearance: textfield;
  }
`;

export const square = css`
  position: relative;
  width: 100%;

  :after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  img,
  video {
    object-fit: cover;
  }

  img,
  video,
  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: var(--radius-default);
  }
`;

export const beatAnimate = (durationS) =>
  css`
    @keyframes beat {
      30% {
        transform: scale(1.5);
      }
      60% {
        transform: scale(1);
      }
    }

    animation: beat ${durationS}s cubic-bezier(0.5, 0, 0.5, 1) 0s infinite normal none;
  `;
