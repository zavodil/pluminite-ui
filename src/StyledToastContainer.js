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
    font-family: 'Comfortaa', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
      'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-size: 18px;
    line-height: 20px;
    cursor: default;

    @media only screen and (max-width: 480px) {
      border-radius: var(--radius-default);
    }
  }

  .Toastify__toast--success {
    border-color: var(--green);

    .Toastify__close-button > svg {
      fill: var(--green);
      stroke: var(--green);
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
