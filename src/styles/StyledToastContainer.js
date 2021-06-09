import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';

const StyledToastContainer = styled(ToastContainer)`
  width: 450px;

  @media only screen and (max-width: 480px) {
    width: 100%;
  }

  &.Toastify__toast-container--bottom-right {
    bottom: 0;
    right: 0;

    @media only screen and (max-width: 480px) {
      bottom: 0;
      right: 0;
    }
  }

  .Toastify__toast {
    margin: 20px;
    padding: 30px;
    border: 1px solid;
    border-radius: var(--radius-default);
    background-color: var(--plum);
    color: var(--lavendar);
    font-family: var(--font-primary);
    font-size: 18px;
    line-height: 20px;
    cursor: default;

    &-body {
      width: 100%;
      word-break: break-word;
    }

    &--success {
      border-color: var(--success);
      background-color: var(--success-bg);

      .Toastify__close-button > svg {
        fill: var(--success);
        stroke: var(--success);
      }
    }

    &--error {
      border-color: var(--error);

      .Toastify__close-button > svg {
        fill: var(--error);
        stroke: var(--error);
      }
    }
  }

  .Toastify__close-button {
    align-self: center;

    > svg {
      height: 20px;
      width: 20px;
    }
  }
`;

export default StyledToastContainer;
