import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { APP } from '~/constants';

const Container = styled('footer')`
  z-index: 1;
  padding: 24px;
  background-color: var(--plum);
  box-shadow: 0 0 74px rgba(190, 20, 205, 0.45);
  font-size: 16px;
  text-align: center;

  .links {
    display: flex;
    justify-content: space-between;
    max-width: 912px;
    margin: 0 auto 20px;
  }

  a {
    color: var(--lavendar);
    transition: color 250ms;

    :hover {
      color: var(--periwinkle);
    }
  }

  .bottom {
    margin-bottom: 40px;
  }

  @media (min-width: 767px) {
    font-size: 20px;
  }
`;

export default function Footer() {
  return (
    <Container>
      <div className="links">
        <Link to="/terms">Terms of Service</Link>
        <Link to="/faq">FAQs</Link>
        <a href="https://2biqpwq7khk.typeform.com/to/FgnGmWij">Report Content</a>
      </div>
      <div className="bottom">{APP.NAME} is in Open Beta :)</div>
      <a href="https://discord.gg/3gCbaHbEkp">Join our Discord server!</a>
    </Container>
  );
}
