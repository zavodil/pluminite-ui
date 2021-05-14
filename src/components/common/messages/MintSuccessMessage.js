import React, { useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import Message from './Message';

const StyledContainer = styled.div`
  .message {
    margin: 0;
  }

  .link {
    color: var(--lavendar);
    font-size: 16px;

    :hover {
      color: var(--periwinkle);
    }
  }
`;

const MintSuccessMessage = () => {
  const toastId = useRef(null);
  const dismiss = () => toast.dismiss(toastId.current);

  return (
    <StyledContainer>
      <Message>
        <p className="message">Your NFT is on the marketplace.</p>
        <Link to="/mint" className="link" onClick={dismiss}>
          Mint another gem →
        </Link>
      </Message>
    </StyledContainer>
  );
};

export default MintSuccessMessage;
